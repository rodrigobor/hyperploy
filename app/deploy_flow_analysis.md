# Análise do Fluxo de Deploy e Taxas na HyperEVM

## Visão Geral

Este documento analisa o fluxo de deploy de contratos inteligentes na HyperEVM e a lógica para limitar custos e redirecionar taxas, conforme requisitado para o Mini App Hyperploy.

## Requisitos Específicos

1. **Limite de custo**: O deploy de contrato deve custar no máximo 0.003 HYPE
2. **Redirecionamento de sobra**: O valor não utilizado do limite deve ser enviado para `0xC6E5e68492fb7D73955c4F80168552C638844409`

## Características da HyperEVM

Com base na documentação oficial:

- A HyperEVM usa o hardfork Cancun sem blobs
- EIP-1559 está habilitado na HyperEVM
- Taxas base são queimadas (removidas do supply total da EVM)
- Taxas prioritárias também são queimadas (enviadas para o endereço zero)
- HYPE tem 18 decimais tanto na mainnet quanto na testnet
- Chain ID da mainnet: 999
- JSON-RPC endpoint da mainnet: `https://rpc.hyperliquid.xyz/evm`

## Cálculo de Custo de Deploy

O custo de deploy de um contrato inteligente na HyperEVM, assim como em outras redes EVM, é composto por:

1. **Gas base da transação**: 21.000 gas (padrão para todas as transações)
2. **Gas do código do contrato**: Varia conforme a complexidade do contrato
   - Custo por byte de código não-zero: 16 gas
   - Custo por byte de código zero: 4 gas
3. **Gas de armazenamento inicial**: 32.000 gas (fixo para criação de contratos)
4. **Gas de execução do construtor**: Varia conforme a lógica do construtor

### Estimativa de Gas Total

Para um contrato simples:
- Base: 21.000 gas
- Criação: 32.000 gas
- Código (estimativa para contrato básico): ~100.000 gas
- Construtor (estimativa): ~50.000 gas
- **Total estimado**: ~200.000 gas

Para garantir que o custo não ultrapasse 0.003 HYPE, precisamos:

1. Estimar o gas total necessário para o deploy
2. Multiplicar pelo preço atual do gas na rede
3. Verificar se o resultado está abaixo de 0.003 HYPE
4. Ajustar o contrato se necessário para reduzir o consumo de gas

## Fluxo de Deploy e Redirecionamento

### Passo 1: Preparação do Deploy

1. O usuário conecta sua carteira ao Mini App
2. O Mini App solicita permissão para interagir com a carteira
3. O usuário carrega o código do contrato ou seleciona um template
4. O Mini App estima o gas necessário para o deploy

### Passo 2: Verificação de Limite

1. Calcular o custo estimado em HYPE: `gasEstimado * preçoGas`
2. Verificar se o custo está abaixo de 0.003 HYPE
3. Se estiver acima, informar ao usuário e sugerir otimizações
4. Se estiver abaixo, prosseguir com o deploy

### Passo 3: Deploy com Redirecionamento

Para implementar o redirecionamento da sobra, temos duas abordagens possíveis:

#### Opção 1: Contrato Intermediário

1. Criar um contrato intermediário que:
   - Recebe até 0.003 HYPE do usuário
   - Realiza o deploy do contrato do usuário
   - Calcula a sobra: `0.003 HYPE - (gasUsado * preçoGas)`
   - Transfere a sobra para `0xC6E5e68492fb7D73955c4F80168552C638844409`

#### Opção 2: Duas Transações

1. O usuário autoriza o gasto de até 0.003 HYPE
2. O Mini App realiza o deploy usando apenas o gas necessário
3. Após o deploy, o Mini App calcula a sobra
4. O Mini App solicita ao usuário autorização para transferir a sobra
5. O valor restante é enviado para `0xC6E5e68492fb7D73955c4F80168552C638844409`

### Passo 4: Confirmação e Feedback

1. Mostrar ao usuário:
   - Endereço do contrato deployado
   - Custo total do deploy em HYPE
   - Valor da sobra enviado para o endereço especificado
   - Link para o explorer da transação

## Considerações Técnicas

### Estimativa Precisa de Gas

Para estimar com precisão o gas necessário, podemos usar:

```javascript
// Usando ethers.js
const factory = new ethers.ContractFactory(abi, bytecode, signer);
const deploymentData = factory.getDeployTransaction(...args).data;
const gasEstimate = await provider.estimateGas({
  data: deploymentData
});
```

### Cálculo da Sobra

```javascript
// Usando ethers.js
const maxCost = ethers.utils.parseEther("0.003"); // 0.003 HYPE em wei
const gasPrice = await provider.getGasPrice();
const actualCost = gasEstimate.mul(gasPrice);
const remainder = maxCost.sub(actualCost);

// Verificar se a sobra é positiva
if (remainder.gt(0)) {
  // Transferir a sobra
  const tx = await signer.sendTransaction({
    to: "0xC6E5e68492fb7D73955c4F80168552C638844409",
    value: remainder
  });
  await tx.wait();
}
```

## Recomendação

Recomendamos a **Opção 1 (Contrato Intermediário)** pelos seguintes motivos:

1. **Experiência do usuário**: Requer apenas uma autorização do usuário
2. **Segurança**: Garante que a sobra seja sempre enviada para o endereço correto
3. **Eficiência**: Reduz o número de transações e, consequentemente, o custo total

O contrato intermediário deve ser auditado para garantir que:
- Não exceda o limite de 0.003 HYPE
- Sempre envie a sobra para o endereço correto
- Não tenha vulnerabilidades de segurança

## Próximos Passos

1. Implementar o contrato intermediário
2. Desenvolver a interface do Mini App para interagir com o contrato
3. Testar o fluxo completo na testnet
4. Validar o cálculo de custos e o redirecionamento da sobra
