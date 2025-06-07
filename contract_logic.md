# Lógica do Contrato Intermediário para Hyperploy

## Visão Geral

Este documento detalha a lógica do contrato intermediário que será utilizado para garantir o limite de custo de deploy e o redirecionamento automático da sobra para o endereço especificado.

## Requisitos Funcionais

1. **Limite de custo**: Garantir que o deploy não ultrapasse 0.003 HYPE
2. **Redirecionamento automático**: Enviar a sobra para `0xC6E5e68492fb7D73955c4F80168552C638844409`
3. **Transparência**: Emitir eventos para rastreamento das operações
4. **Segurança**: Prevenir ataques e garantir que fundos não fiquem presos no contrato

## Estrutura do Contrato

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HyperployDeployer
 * @dev Contrato intermediário para deploy com limite de custo e redirecionamento de sobra
 */
contract HyperployDeployer {
    // Endereço para onde a sobra será enviada
    address public constant RECIPIENT = 0xC6E5e68492fb7D73955c4F80168552C638844409;
    
    // Limite máximo de HYPE permitido para deploy
    uint256 public constant MAX_DEPLOY_COST = 0.003 ether;
    
    // Eventos para rastreamento
    event ContractDeployed(address indexed deployer, address indexed deployedContract, uint256 gasCost);
    event RemainderSent(address indexed recipient, uint256 amount);
    
    /**
     * @dev Função para deploy de contrato com bytecode fornecido
     * @param bytecode O bytecode do contrato a ser deployado
     * @return deployedAddress O endereço do contrato deployado
     */
    function deployContract(bytes memory bytecode) external payable returns (address deployedAddress) {
        // Verificar se o valor enviado não excede o limite
        require(msg.value <= MAX_DEPLOY_COST, "Valor excede o limite permitido");
        
        // Registrar saldo inicial
        uint256 initialBalance = address(this).balance - msg.value;
        
        // Deploy do contrato
        assembly {
            deployedAddress := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        
        // Verificar se o deploy foi bem-sucedido
        require(deployedAddress != address(0), "Falha no deploy do contrato");
        
        // Calcular custo real do deploy (baseado no gas usado)
        uint256 remainingBalance = address(this).balance;
        uint256 deploymentCost = msg.value - (remainingBalance - initialBalance);
        
        // Emitir evento de deploy
        emit ContractDeployed(msg.sender, deployedAddress, deploymentCost);
        
        // Calcular e enviar a sobra
        uint256 remainder = remainingBalance - initialBalance;
        if (remainder > 0) {
            (bool success, ) = RECIPIENT.call{value: remainder}("");
            require(success, "Falha ao enviar a sobra");
            emit RemainderSent(RECIPIENT, remainder);
        }
    }
    
    /**
     * @dev Função para deploy de contrato com bytecode e argumentos do construtor
     * @param bytecode O bytecode do contrato a ser deployado
     * @param constructorArgs Os argumentos do construtor codificados
     * @return deployedAddress O endereço do contrato deployado
     */
    function deployContractWithArgs(bytes memory bytecode, bytes memory constructorArgs) external payable returns (address deployedAddress) {
        // Concatenar bytecode e argumentos do construtor
        bytes memory deployData = abi.encodePacked(bytecode, constructorArgs);
        
        // Chamar a função de deploy principal
        return deployContract(deployData);
    }
    
    /**
     * @dev Função de fallback para evitar que ETH fique preso no contrato
     */
    receive() external payable {
        // Redirecionar qualquer ETH recebido diretamente para o RECIPIENT
        (bool success, ) = RECIPIENT.call{value: msg.value}("");
        require(success, "Falha ao encaminhar ETH");
        emit RemainderSent(RECIPIENT, msg.value);
    }
}
```

## Fluxo de Execução

1. **Inicialização**:
   - O usuário envia até 0.003 HYPE para o contrato
   - O contrato verifica se o valor não excede o limite

2. **Deploy**:
   - O contrato realiza o deploy usando o bytecode fornecido
   - O gas é consumido da quantidade de HYPE enviada

3. **Cálculo e Redirecionamento**:
   - O contrato calcula a sobra: `valorEnviado - gastoReal`
   - A sobra é automaticamente enviada para o endereço RECIPIENT
   - Eventos são emitidos para registrar o deploy e o envio da sobra

## Considerações de Segurança

1. **Prevenção de Reentrância**:
   - O padrão checks-effects-interactions é seguido
   - Todas as modificações de estado ocorrem antes das chamadas externas

2. **Limites de Gas**:
   - O contrato não impõe limites de gas artificiais
   - O usuário pode ajustar o gas limit conforme necessário

3. **Validação de Entrada**:
   - O bytecode é validado antes do deploy
   - O valor enviado é verificado contra o limite máximo

4. **Tratamento de Falhas**:
   - Falhas no deploy são detectadas e reportadas
   - Falhas no envio da sobra revertem toda a transação

5. **Prevenção de Fundos Presos**:
   - Função receive() garante que qualquer HYPE enviado diretamente seja redirecionado

## Interação com o Mini App

O Mini App interagirá com este contrato da seguinte forma:

1. **Estimativa de Gas**:
   ```javascript
   const factory = new ethers.ContractFactory(abi, bytecode, signer);
   const deploymentData = factory.getDeployTransaction(...args).data;
   const gasEstimate = await provider.estimateGas({
     data: deploymentData
   });
   const gasPrice = await provider.getGasPrice();
   const estimatedCost = gasEstimate.mul(gasPrice);
   ```

2. **Verificação de Limite**:
   ```javascript
   const maxCost = ethers.utils.parseEther("0.003");
   if (estimatedCost.gt(maxCost)) {
     // Alertar usuário que o contrato é muito complexo
   }
   ```

3. **Deploy via Contrato Intermediário**:
   ```javascript
   const deployer = new ethers.Contract(deployerAddress, deployerAbi, signer);
   const tx = await deployer.deployContract(bytecode, {
     value: ethers.utils.parseEther("0.003")
   });
   const receipt = await tx.wait();
   
   // Extrair endereço do contrato deployado e outros detalhes dos eventos
   const deployedEvent = receipt.events.find(e => e.event === 'ContractDeployed');
   const deployedAddress = deployedEvent.args.deployedContract;
   const gasCost = deployedEvent.args.gasCost;
   
   const remainderEvent = receipt.events.find(e => e.event === 'RemainderSent');
   const remainder = remainderEvent ? remainderEvent.args.amount : 0;
   ```

## Testes e Validação

Antes da implementação final, o contrato deve passar por:

1. **Testes Unitários**:
   - Verificar deploy bem-sucedido
   - Verificar cálculo correto da sobra
   - Verificar envio da sobra para o endereço correto

2. **Testes de Integração**:
   - Testar com diferentes tipos de contratos
   - Verificar comportamento com diferentes valores de gas

3. **Auditoria de Segurança**:
   - Revisar vulnerabilidades comuns
   - Verificar conformidade com padrões de segurança

## Limitações

1. **Contratos Complexos**:
   - Contratos muito complexos podem exceder o limite de 0.003 HYPE
   - Nesses casos, o usuário será notificado para simplificar o contrato

2. **Flutuações de Gas**:
   - Picos no preço do gas podem afetar a estimativa
   - Recomenda-se incluir uma margem de segurança nas estimativas

3. **Compatibilidade**:
   - O contrato é compatível apenas com a HyperEVM
   - Não deve ser usado em outras redes EVM sem adaptações
