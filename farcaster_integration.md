# Validação de Funcionalidades do Farcaster no Mini App Hyperploy

## Visão Geral

Este documento valida as funcionalidades essenciais do Farcaster que devem ser integradas ao Mini App Hyperploy, garantindo que todas as capacidades necessárias estejam contempladas no planejamento e sejam tecnicamente viáveis.

## Funcionalidades Essenciais do Farcaster

### 1. Autenticação e Conexão de Carteira

#### Requisitos:
- Permitir que usuários se conectem com sua identidade Farcaster
- Acessar a carteira Ethereum do usuário através do SDK do Farcaster
- Verificar e solicitar mudança para a rede HyperEVM quando necessário

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';

// Hook personalizado para autenticação
export function useFarcasterAuth() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  
  // Verificar se está na rede HyperEVM (Chain ID 999)
  const checkAndSwitchNetwork = async () => {
    const currentChainId = await sdk.getChainId();
    setChainId(currentChainId);
    
    if (currentChainId !== 999) {
      try {
        await sdk.switchChain(999);
        setChainId(999);
        return true;
      } catch (error) {
        console.error('Erro ao trocar de rede:', error);
        return false;
      }
    }
    return true;
  };
  
  // Conectar carteira
  const connect = async () => {
    try {
      const userAccount = await sdk.getAccount();
      if (userAccount) {
        setAccount(userAccount);
        setIsConnected(true);
        await checkAndSwitchNetwork();
        return userAccount;
      }
    } catch (error) {
      console.error('Erro ao conectar com Farcaster:', error);
      setIsConnected(false);
      setAccount(null);
    }
    return null;
  };
  
  return {
    account,
    isConnected,
    chainId,
    connect,
    checkAndSwitchNetwork
  };
}
```

#### Status: ✅ Viável
A autenticação via Farcaster SDK está bem documentada e permite acesso à carteira do usuário, com suporte para verificação e troca de rede.

### 2. Sistema de Notificações

#### Requisitos:
- Enviar notificações para o usuário sobre o status do deploy
- Notificar quando o deploy for concluído com sucesso
- Alertar sobre erros ou problemas durante o processo

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';

// Serviço de notificações
export const NotificationService = {
  // Notificação de deploy iniciado
  sendDeployStarted: async () => {
    try {
      await sdk.sendNotification({
        title: 'Contract Deployment Started',
        body: 'Your contract is being deployed to HyperEVM. This may take a moment.',
        icon: '/icons/deploying.png'
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de início:', error);
      return false;
    }
  },
  
  // Notificação de deploy concluído
  sendDeploySuccess: async (contractAddress) => {
    try {
      await sdk.sendNotification({
        title: 'Contract Deployed Successfully',
        body: `Your contract was deployed to ${contractAddress}`,
        url: `https://explorer.hyperliquid.xyz/address/${contractAddress}`,
        icon: '/icons/success.png'
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de sucesso:', error);
      return false;
    }
  },
  
  // Notificação de erro
  sendDeployError: async (errorMessage) => {
    try {
      await sdk.sendNotification({
        title: 'Deployment Failed',
        body: `Error: ${errorMessage}. Please try again.`,
        icon: '/icons/error.png'
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de erro:', error);
      return false;
    }
  }
};
```

#### Status: ✅ Viável
O SDK do Farcaster oferece suporte completo para envio de notificações, permitindo título, corpo, ícone e URL de redirecionamento.

### 3. Integração com Carteira para Transações

#### Requisitos:
- Interagir com a carteira do usuário para autorizar transações
- Enviar transações para a rede HyperEVM
- Monitorar o status das transações

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';
import { ethers } from 'ethers';
import { DEPLOYER_ABI, DEPLOYER_ADDRESS } from '../constants/addresses';

// Serviço de deploy
export const DeployerService = {
  // Obter provider e signer
  getProviderAndSigner: () => {
    const provider = sdk.getProvider();
    const signer = provider.getSigner();
    return { provider, signer };
  },
  
  // Estimar gas para deploy
  estimateDeployGas: async (bytecode, constructorArgs) => {
    try {
      const { provider, signer } = DeployerService.getProviderAndSigner();
      
      // Criar contrato deployer
      const deployer = new ethers.Contract(
        DEPLOYER_ADDRESS,
        DEPLOYER_ABI,
        signer
      );
      
      // Estimar gas
      const gasEstimate = await deployer.estimateGas.deployContractWithArgs(
        bytecode,
        constructorArgs,
        { value: ethers.utils.parseEther("0.003") }
      );
      
      // Obter preço do gas
      const gasPrice = await provider.getGasPrice();
      
      // Calcular custo estimado
      const estimatedCost = gasEstimate.mul(gasPrice);
      
      return {
        gasEstimate,
        gasPrice,
        estimatedCost: ethers.utils.formatEther(estimatedCost),
        maxCost: "0.003"
      };
    } catch (error) {
      console.error('Erro ao estimar gas:', error);
      throw error;
    }
  },
  
  // Deploy do contrato
  deployContract: async (bytecode, constructorArgs) => {
    try {
      const { signer } = DeployerService.getProviderAndSigner();
      
      // Criar contrato deployer
      const deployer = new ethers.Contract(
        DEPLOYER_ADDRESS,
        DEPLOYER_ABI,
        signer
      );
      
      // Realizar o deploy
      const tx = await deployer.deployContractWithArgs(
        bytecode,
        constructorArgs,
        { value: ethers.utils.parseEther("0.003") }
      );
      
      // Aguardar confirmação
      const receipt = await tx.wait();
      
      // Extrair endereço do contrato deployado dos eventos
      const deployedEvent = receipt.events.find(e => e.event === 'ContractDeployed');
      const deployedAddress = deployedEvent.args.deployedContract;
      const gasCost = ethers.utils.formatEther(deployedEvent.args.gasCost);
      
      // Extrair informações sobre a sobra
      const remainderEvent = receipt.events.find(e => e.event === 'RemainderSent');
      const remainder = remainderEvent 
        ? ethers.utils.formatEther(remainderEvent.args.amount)
        : "0";
      
      return {
        success: true,
        deployedAddress,
        transactionHash: receipt.transactionHash,
        gasCost,
        remainder
      };
    } catch (error) {
      console.error('Erro ao fazer deploy do contrato:', error);
      throw error;
    }
  }
};
```

#### Status: ✅ Viável
A integração com carteiras via SDK do Farcaster permite todas as operações necessárias para autorização e envio de transações, bem como monitoramento de status.

### 4. Compartilhamento no Feed

#### Requisitos:
- Permitir que usuários compartilhem o contrato deployado em seu feed
- Incluir informações relevantes como endereço do contrato e custo

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';

// Serviço de compartilhamento
export const SharingService = {
  // Compartilhar contrato deployado
  shareDeployedContract: async (contractAddress, contractName, gasCost, remainder) => {
    try {
      const shareText = `I just deployed "${contractName}" on HyperEVM using Hyperploy!\n\nContract: ${contractAddress}\nCost: ${gasCost} HYPE\nRemainder: ${remainder} HYPE sent to community wallet\n\nDeploy your own contracts at hyperploy.app`;
      
      await sdk.share({
        text: shareText,
        url: `https://explorer.hyperliquid.xyz/address/${contractAddress}`
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao compartilhar no feed:', error);
      return false;
    }
  }
};
```

#### Status: ✅ Viável
O SDK do Farcaster suporta compartilhamento no feed, permitindo texto personalizado e URL.

### 5. Detecção de Capacidades

#### Requisitos:
- Detectar se o cliente Farcaster suporta as capacidades necessárias
- Adaptar a interface com base nas capacidades disponíveis

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';

// Hook para detecção de capacidades
export function useFarcasterCapabilities() {
  const [capabilities, setCapabilities] = useState({
    ethereum: false,
    notifications: false,
    sharing: false
  });
  
  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        // Verificar suporte a Ethereum
        const hasEthereum = await sdk.hasCapability('ethereum');
        
        // Verificar suporte a notificações
        const hasNotifications = await sdk.hasCapability('notifications');
        
        // Verificar suporte a compartilhamento
        const hasSharing = await sdk.hasCapability('sharing');
        
        setCapabilities({
          ethereum: hasEthereum,
          notifications: hasNotifications,
          sharing: hasSharing
        });
      } catch (error) {
        console.error('Erro ao detectar capacidades:', error);
      }
    };
    
    detectCapabilities();
  }, []);
  
  return capabilities;
}
```

#### Status: ✅ Viável
O SDK do Farcaster permite verificar as capacidades suportadas pelo cliente, permitindo adaptação da interface.

### 6. Navegação e URLs do Mini App

#### Requisitos:
- Suportar navegação entre diferentes telas do Mini App
- Permitir links diretos para partes específicas do aplicativo

#### Implementação no Hyperploy:
```javascript
import { sdk } from '@farcaster/frame-sdk';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Hook para navegação
export function useFarcasterNavigation() {
  const router = useRouter();
  
  // Registrar manipulador de navegação de volta
  useEffect(() => {
    const handleBackNavigation = () => {
      // Verificar se podemos navegar para trás na história do navegador
      if (window.history.length > 1) {
        router.back();
        return true; // Navegação tratada
      }
      return false; // Deixar o Farcaster lidar com a navegação
    };
    
    // Registrar manipulador
    sdk.onBackNavigation(handleBackNavigation);
    
    return () => {
      // Limpar ao desmontar
      sdk.offBackNavigation(handleBackNavigation);
    };
  }, [router]);
  
  // Função para navegar para uma rota específica
  const navigateTo = (route) => {
    router.push(route);
  };
  
  return { navigateTo };
}
```

#### Status: ✅ Viável
O SDK do Farcaster suporta navegação e manipulação de eventos de navegação, permitindo uma experiência fluida.

### 7. Adição do Mini App

#### Requisitos:
- Permitir que usuários adicionem o Mini App à sua lista de apps
- Fornecer metadados apropriados para listagem

#### Implementação no Hyperploy:
```javascript
// public/manifest.json
{
  "name": "Hyperploy",
  "short_name": "Hyperploy",
  "description": "Deploy smart contracts on HyperEVM with cost capped at 0.003 HYPE",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "farcaster": {
    "capabilities": ["ethereum", "notifications", "sharing"],
    "categories": ["developer", "defi", "tools"],
    "screenshots": [
      "/screenshots/home.png",
      "/screenshots/deploy.png",
      "/screenshots/success.png"
    ]
  }
}
```

```html
<!-- Adicionar no <head> do index.html -->
<link rel="manifest" href="/manifest.json" />
<meta name="fc:frame:image" content="https://hyperploy.app/og-image.png" />
<meta name="fc:frame:post_url" content="https://hyperploy.app/api/frame" />
<meta name="fc:frame:button:1" content="Open Hyperploy" />
```

#### Status: ✅ Viável
O Farcaster suporta adição de Mini Apps através de metadados apropriados no manifest.json e meta tags.

## Matriz de Compatibilidade

| Funcionalidade | Suporte no SDK | Implementação no Hyperploy | Status |
|----------------|----------------|----------------------------|--------|
| Autenticação | ✅ | Implementado via hook personalizado | Viável |
| Notificações | ✅ | Implementado via serviço dedicado | Viável |
| Transações | ✅ | Implementado via serviço de deploy | Viável |
| Compartilhamento | ✅ | Implementado via serviço de compartilhamento | Viável |
| Detecção de Capacidades | ✅ | Implementado via hook personalizado | Viável |
| Navegação | ✅ | Implementado via hook integrado com Next.js | Viável |
| Adição do Mini App | ✅ | Implementado via manifest e meta tags | Viável |

## Considerações Adicionais

### Fallbacks para Funcionalidades Não Suportadas

Para garantir que o Mini App funcione mesmo quando certas capacidades não estão disponíveis:

1. **Sem Suporte a Notificações**:
   - Mostrar notificações dentro da aplicação
   - Fornecer feedback visual sobre o status do deploy

2. **Sem Suporte a Compartilhamento**:
   - Oferecer opção para copiar texto formatado para compartilhamento manual
   - Fornecer link direto para o contrato no explorer

3. **Sem Suporte a Ethereum**:
   - Redirecionar para uma versão web tradicional com suporte a carteiras externas
   - Mostrar instruções para uso de carteiras compatíveis

### Testes de Integração

Antes do lançamento, é essencial testar todas as integrações com o Farcaster:

1. **Teste de Autenticação**:
   - Verificar conexão bem-sucedida
   - Testar troca de rede para HyperEVM
   - Validar recuperação de erros

2. **Teste de Notificações**:
   - Verificar entrega de notificações
   - Testar diferentes tipos de notificação
   - Validar comportamento quando notificações são negadas

3. **Teste de Transações**:
   - Verificar autorização de transações
   - Testar estimativa de gas
   - Validar monitoramento de status

## Conclusão

Todas as funcionalidades essenciais do Farcaster necessárias para o Mini App Hyperploy são tecnicamente viáveis e podem ser implementadas conforme planejado. A documentação do SDK do Farcaster é abrangente e fornece todos os métodos necessários para uma integração completa.

Recomenda-se prosseguir com o desenvolvimento do protótipo, implementando primeiro as funcionalidades core (autenticação e transações) e depois adicionando as funcionalidades complementares (notificações e compartilhamento).
