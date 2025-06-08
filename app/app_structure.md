# Estrutura e Funcionalidades do Mini App Hyperploy

## Visão Geral

O Hyperploy é um Mini App para o Farcaster que permite aos usuários realizar o deploy de contratos inteligentes na rede HyperEVM com um limite de custo de 0.003 HYPE, redirecionando automaticamente a sobra para um endereço específico.

## Arquitetura do Mini App

### Tecnologias Principais

1. **Frontend**:
   - Framework: React com TypeScript
   - Estilização: TailwindCSS para responsividade
   - Biblioteca de componentes: shadcn/ui adaptada para as cores da Hyperliquid

2. **Integração**:
   - Farcaster Mini App SDK: `@farcaster/frame-sdk`
   - Biblioteca Ethereum: ethers.js para interação com a HyperEVM
   - Solidity: para o contrato intermediário de deploy

3. **Estrutura de Diretórios**:
```
/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Deploy.tsx
│   │       ├── ContractDetails.tsx
│   │       └── Success.tsx
│   ├── constants/
│   │   ├── addresses.ts
│   │   ├── chains.ts
│   │   └── theme.ts
│   ├── contexts/
│   │   ├── WalletContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/
│   │   ├── useContract.ts
│   │   ├── useDeployer.ts
│   │   └── useFarcaster.ts
│   ├── services/
│   │   ├── contractService.ts
│   │   ├── deployerService.ts
│   │   └── notificationService.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── estimators.ts
│   ├── App.tsx
│   └── index.tsx
├── contracts/
│   ├── HyperployDeployer.sol
│   └── artifacts/
├── package.json
└── tsconfig.json
```

## Fluxo do Usuário

### 1. Página Inicial
- **Objetivo**: Apresentar o Mini App e suas funcionalidades
- **Elementos**:
  - Logo e nome do aplicativo
  - Breve descrição do propósito
  - Botão para iniciar o processo de deploy
  - Informações sobre limites de custo e redirecionamento

### 2. Conexão de Carteira
- **Objetivo**: Conectar a carteira do usuário para interação com a HyperEVM
- **Elementos**:
  - Solicitação de conexão via SDK do Farcaster
  - Verificação de rede (deve ser HyperEVM)
  - Exibição do saldo de HYPE disponível

### 3. Configuração do Contrato
- **Objetivo**: Permitir ao usuário configurar o contrato a ser deployado
- **Elementos**:
  - Upload de arquivo Solidity ou bytecode
  - Editor de código integrado (opcional)
  - Seleção de templates pré-configurados
  - Configuração de parâmetros do construtor

### 4. Estimativa e Verificação
- **Objetivo**: Estimar o custo do deploy e verificar se está dentro do limite
- **Elementos**:
  - Cálculo de estimativa de gas
  - Exibição do custo estimado em HYPE
  - Verificação do limite de 0.003 HYPE
  - Alertas de otimização se necessário

### 5. Confirmação e Deploy
- **Objetivo**: Confirmar detalhes e realizar o deploy
- **Elementos**:
  - Resumo do contrato a ser deployado
  - Confirmação do custo máximo (0.003 HYPE)
  - Informação sobre redirecionamento da sobra
  - Botão de confirmação para iniciar o deploy

### 6. Processamento e Resultado
- **Objetivo**: Mostrar o progresso e resultado do deploy
- **Elementos**:
  - Indicador de progresso durante o deploy
  - Detalhes da transação concluída
  - Endereço do contrato deployado
  - Custo real do deploy e valor redirecionado
  - Opção para compartilhar no Farcaster

## Funcionalidades Principais

### 1. Integração com Carteira
- Conexão direta com a carteira via SDK do Farcaster
- Suporte à rede HyperEVM (Chain ID 999)
- Verificação de saldo suficiente para o deploy

### 2. Editor e Validador de Contratos
- Interface para upload ou edição de contratos
- Validação básica de sintaxe Solidity
- Templates pré-configurados para facilitar o uso

### 3. Estimador de Gas
- Cálculo preciso do custo estimado de deploy
- Verificação automática contra o limite de 0.003 HYPE
- Sugestões de otimização para reduzir custos

### 4. Deploy Seguro
- Utilização do contrato intermediário para garantir o limite
- Processo transparente com feedback em tempo real
- Tratamento de erros e recuperação

### 5. Notificações Farcaster
- Envio de notificações sobre status do deploy
- Opção de compartilhar o contrato deployado
- Alertas sobre o processo de deploy

### 6. Rastreamento e Histórico
- Histórico de contratos deployados pelo usuário
- Detalhes de cada deploy, incluindo custos e sobras
- Links para explorer da HyperEVM

## Integrações Específicas com Farcaster

### 1. Autenticação
```javascript
// Exemplo de integração com autenticação Farcaster
import { sdk } from '@farcaster/frame-sdk';

const connectWallet = async () => {
  try {
    const account = await sdk.getAccount();
    if (account) {
      // Verificar se está na rede correta (HyperEVM)
      const chainId = await sdk.getChainId();
      if (chainId !== 999) {
        await sdk.switchChain(999);
      }
      return account;
    }
  } catch (error) {
    console.error('Erro ao conectar carteira:', error);
  }
};
```

### 2. Notificações
```javascript
// Exemplo de envio de notificação
const sendDeployNotification = async (contractAddress) => {
  try {
    await sdk.sendNotification({
      title: 'Contract Deployed Successfully',
      body: `Your contract was deployed to ${contractAddress}`,
      url: `https://explorer.hyperliquid.xyz/address/${contractAddress}`
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
};
```

### 3. Interação com Carteira
```javascript
// Exemplo de interação com a carteira para deploy
const deployContract = async (bytecode, constructorArgs) => {
  try {
    // Obter o contrato deployer
    const deployer = new ethers.Contract(
      DEPLOYER_ADDRESS,
      DEPLOYER_ABI,
      sdk.getProvider().getSigner()
    );
    
    // Realizar o deploy com o valor máximo permitido
    const tx = await deployer.deployContractWithArgs(
      bytecode,
      constructorArgs,
      { value: ethers.utils.parseEther("0.003") }
    );
    
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao fazer deploy do contrato:', error);
    throw error;
  }
};
```

## Considerações de UX/UI

### 1. Design Responsivo
- Layout adaptável para diferentes tamanhos de tela
- Experiência otimizada para dispositivos móveis (onde o Farcaster é mais usado)
- Elementos de interface intuitivos e acessíveis

### 2. Feedback Visual
- Indicadores claros de progresso durante operações
- Mensagens de erro informativas e acionáveis
- Confirmações visuais de ações bem-sucedidas

### 3. Acessibilidade
- Alto contraste entre elementos (considerando as cores da Hyperliquid)
- Textos legíveis e tamanhos de fonte adequados
- Suporte a navegação por teclado e leitores de tela

### 4. Performance
- Carregamento rápido e otimizado
- Minimização de dependências externas
- Caching de dados quando apropriado

## Requisitos Técnicos

### 1. Ambiente de Desenvolvimento
- Node.js 18+
- React 18+
- TypeScript 5+
- Ethers.js 6+
- Solidity 0.8.20+

### 2. Dependências Principais
```json
{
  "dependencies": {
    "@farcaster/frame-sdk": "^0.7.0",
    "ethers": "^6.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.4",
    "lucide-react": "^0.284.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^4.4.9",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7"
  }
}
```

### 3. Compatibilidade
- Navegadores modernos (Chrome, Safari, Firefox, Edge)
- Aplicativo Farcaster (Warpcast e outros clientes)
- Carteiras compatíveis com EIP-1193

## Próximos Passos

1. **Configuração do Ambiente**: Inicializar o projeto React com as dependências necessárias
2. **Implementação do Contrato**: Desenvolver e testar o contrato intermediário
3. **Desenvolvimento da UI**: Criar os componentes de interface seguindo o design proposto
4. **Integração com Farcaster**: Implementar as funcionalidades do SDK
5. **Testes**: Validar o fluxo completo em ambiente de teste
6. **Deploy**: Publicar o Mini App na plataforma Farcaster
