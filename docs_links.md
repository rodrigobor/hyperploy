# Documentação e Links Importantes

## Farcaster Mini Apps

1. **Documentação Oficial**
   - [Getting Started](https://miniapps.farcaster.xyz/docs/getting-started) - Visão geral e configuração inicial
   - [Especificação](https://miniapps.farcaster.xyz/docs/specification) - Detalhes técnicos e requisitos
   - [Publicação](https://miniapps.farcaster.xyz/docs/guides/publishing) - Como publicar um Mini App

2. **Integração com Carteiras**
   - [Interagindo com Carteiras Ethereum](https://miniapps.farcaster.xyz/docs/guides/wallets) - Como integrar com carteiras EVM
   - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) - Especificação do Ethereum Provider JavaScript API

3. **Ferramentas de Desenvolvimento**
   - CLI: `npm create @farcaster/mini-app`
   - SDK: `npm install @farcaster/frame-sdk`

## HyperEVM

1. **Documentação Oficial**
   - [HyperEVM Overview](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm) - Visão geral da HyperEVM
   - [HyperCore <> HyperEVM transfers](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers) - Transferências entre HyperCore e HyperEVM

2. **Detalhes Técnicos**
   - **Mainnet**:
     - Chain ID: 999
     - JSON-RPC endpoint: `https://rpc.hyperliquid.xyz/evm`
   - **Testnet**:
     - Chain ID: 998
     - JSON-RPC endpoint: `https://rpc.hyperliquid-testnet.xyz/evm`
   - HYPE tem 18 decimais em ambas as redes
   - HyperEVM usa o hardfork Cancun sem blobs
   - EIP-1559 está habilitado, com taxas base e taxas prioritárias sendo queimadas

3. **Transferência de HYPE**
   - Endereço do sistema para HYPE: `0x2222222222222222222222222222222222222222`
   - Para transferir HYPE de volta ao HyperCore, pode ser enviado como valor de transação
   - Endereço de transferência EVM: `0x222..2` é um contrato de sistema que emite o evento `event Received(address indexed user, uint256 amount)`

## Requisitos do Projeto

1. **Funcionalidades**
   - Deploy de contrato inteligente na rede HyperEVM
   - Limite de custo: máximo 0.003 HYPE
   - Redirecionamento da sobra para: `0xC6E5e68492fb7D73955c4F80168552C638844409`

2. **Design**
   - Totalmente em inglês
   - Cores principais: #072723 e #97fbe3 (cores da Hyperliquid)
   - Interface intuitiva
   - Integração com funcionalidades do Farcaster (adicionar miniapp, notificações)
