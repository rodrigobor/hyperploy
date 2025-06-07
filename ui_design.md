# Design Visual do Mini App Hyperploy

## Paleta de Cores

### Cores Principais (Hyperliquid)
- **Verde Escuro**: `#072723` - Cor primária para fundos e elementos principais
- **Verde Água**: `#97fbe3` - Cor de destaque para botões, links e elementos interativos

### Cores Complementares
- **Verde Médio**: `#0e4a40` - Variação mais clara do verde escuro para elementos secundários
- **Verde Claro**: `#c9fdf0` - Variação mais clara do verde água para hover e elementos sutis
- **Branco**: `#ffffff` - Para textos e elementos sobre fundos escuros
- **Cinza Claro**: `#f0f0f0` - Para áreas de fundo secundárias
- **Cinza Médio**: `#a0a0a0` - Para textos secundários e bordas
- **Cinza Escuro**: `#333333` - Para textos sobre fundos claros

### Estados e Feedback
- **Sucesso**: `#00c853` - Para confirmações e ações bem-sucedidas
- **Alerta**: `#ffd600` - Para avisos e alertas
- **Erro**: `#ff3d00` - Para erros e ações críticas
- **Informativo**: `#2196f3` - Para mensagens informativas

## Tipografia

### Fontes
- **Principal**: `Inter` - Fonte sans-serif moderna e legível
- **Alternativa**: `System UI` - Fallback para compatibilidade

### Tamanhos
- **Título Principal**: 24px (1.5rem)
- **Subtítulo**: 20px (1.25rem)
- **Texto de Destaque**: 18px (1.125rem)
- **Texto Normal**: 16px (1rem)
- **Texto Secundário**: 14px (0.875rem)
- **Texto Pequeno**: 12px (0.75rem)

### Pesos
- **Bold**: 700 - Para títulos e elementos de destaque
- **Semibold**: 600 - Para subtítulos e botões
- **Medium**: 500 - Para textos de destaque
- **Regular**: 400 - Para texto normal
- **Light**: 300 - Para textos secundários

## Componentes UI

### Botões

#### Botão Primário
```css
.btn-primary {
  background-color: #97fbe3;
  color: #072723;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 24px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #c9fdf0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(151, 251, 227, 0.3);
}
```

#### Botão Secundário
```css
.btn-secondary {
  background-color: transparent;
  color: #97fbe3;
  font-weight: 600;
  border: 2px solid #97fbe3;
  border-radius: 8px;
  padding: 10px 22px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgba(151, 251, 227, 0.1);
  transform: translateY(-2px);
}
```

#### Botão de Texto
```css
.btn-text {
  background-color: transparent;
  color: #97fbe3;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.btn-text:hover {
  text-decoration: underline;
}
```

### Cards e Containers

#### Card Principal
```css
.card {
  background-color: #0e4a40;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(7, 39, 35, 0.2);
  border: 1px solid rgba(151, 251, 227, 0.1);
}
```

#### Container de Seção
```css
.section-container {
  background-color: #072723;
  border-radius: 16px;
  padding: 32px;
  margin: 24px 0;
  border: 1px solid rgba(151, 251, 227, 0.05);
}
```

### Formulários

#### Input de Texto
```css
.input {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(151, 251, 227, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #97fbe3;
  box-shadow: 0 0 0 3px rgba(151, 251, 227, 0.2);
  outline: none;
}
```

#### Checkbox
```css
.checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(151, 251, 227, 0.5);
  border-radius: 4px;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
}

.checkbox:checked {
  background-color: #97fbe3;
  border-color: #97fbe3;
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #072723;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

### Notificações e Alertas

#### Toast de Sucesso
```css
.toast-success {
  background-color: #00c853;
  color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
  display: flex;
  align-items: center;
}
```

#### Alerta de Aviso
```css
.alert-warning {
  background-color: rgba(255, 214, 0, 0.1);
  border-left: 4px solid #ffd600;
  color: #ffd600;
  padding: 16px;
  border-radius: 0 8px 8px 0;
  margin: 16px 0;
}
```

## Layout das Telas

### Tela Inicial

![Tela Inicial](https://placeholder-for-mockup.com/home)

```html
<div class="container">
  <header class="header">
    <div class="logo">
      <img src="/logo.svg" alt="Hyperploy Logo" />
      <h1>Hyperploy</h1>
    </div>
    <button class="btn-primary">Connect Wallet</button>
  </header>
  
  <main class="main">
    <section class="hero">
      <h2>Deploy Smart Contracts on HyperEVM</h2>
      <p>Simple, affordable, and secure contract deployment with automatic fee optimization.</p>
      <button class="btn-primary">Start Deploying</button>
    </section>
    
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">💰</div>
        <h3>Cost Capped at 0.003 HYPE</h3>
        <p>Never worry about unexpected gas fees.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔄</div>
        <h3>Automatic Remainder</h3>
        <p>Unused funds are automatically sent to the designated address.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure Deployment</h3>
        <p>Safe and verified contract deployment process.</p>
      </div>
    </section>
  </main>
  
  <footer class="footer">
    <p>Powered by Farcaster & HyperEVM</p>
  </footer>
</div>
```

### Tela de Deploy

![Tela de Deploy](https://placeholder-for-mockup.com/deploy)

```html
<div class="container">
  <header class="header">
    <div class="logo">
      <img src="/logo.svg" alt="Hyperploy Logo" />
      <h1>Hyperploy</h1>
    </div>
    <div class="wallet-info">
      <span>0x1234...5678</span>
      <span class="balance">2.5 HYPE</span>
    </div>
  </header>
  
  <main class="main">
    <div class="card">
      <h2>Deploy Your Contract</h2>
      
      <div class="tabs">
        <button class="tab active">Upload</button>
        <button class="tab">Code Editor</button>
        <button class="tab">Templates</button>
      </div>
      
      <div class="tab-content">
        <div class="upload-area">
          <p>Drag & drop your contract file or click to browse</p>
          <input type="file" id="contract-file" />
          <button class="btn-secondary">Browse Files</button>
        </div>
      </div>
      
      <div class="contract-params">
        <h3>Constructor Parameters</h3>
        <div class="param-inputs">
          <!-- Inputs will be dynamically generated based on contract -->
        </div>
      </div>
      
      <div class="deployment-info">
        <div class="info-item">
          <span>Estimated Gas:</span>
          <span>180,000</span>
        </div>
        <div class="info-item">
          <span>Max Cost:</span>
          <span>0.003 HYPE</span>
        </div>
        <div class="info-item">
          <span>Estimated Cost:</span>
          <span>0.0018 HYPE</span>
        </div>
        <div class="info-item">
          <span>Estimated Remainder:</span>
          <span>0.0012 HYPE</span>
        </div>
      </div>
      
      <button class="btn-primary deploy-btn">Deploy Contract</button>
    </div>
  </main>
</div>
```

### Tela de Sucesso

![Tela de Sucesso](https://placeholder-for-mockup.com/success)

```html
<div class="container">
  <header class="header">
    <div class="logo">
      <img src="/logo.svg" alt="Hyperploy Logo" />
      <h1>Hyperploy</h1>
    </div>
    <div class="wallet-info">
      <span>0x1234...5678</span>
      <span class="balance">2.5 HYPE</span>
    </div>
  </header>
  
  <main class="main">
    <div class="card success-card">
      <div class="success-icon">✅</div>
      <h2>Contract Deployed Successfully!</h2>
      
      <div class="contract-details">
        <div class="detail-item">
          <span>Contract Address:</span>
          <span class="address">0xabcd...1234 <button class="btn-text">Copy</button></span>
        </div>
        <div class="detail-item">
          <span>Transaction Hash:</span>
          <span class="hash">0xefgh...5678 <button class="btn-text">Copy</button></span>
        </div>
        <div class="detail-item">
          <span>Actual Cost:</span>
          <span>0.0017 HYPE</span>
        </div>
        <div class="detail-item">
          <span>Remainder Sent:</span>
          <span>0.0013 HYPE to 0xC6E5...4409</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn-primary">View on Explorer</button>
        <button class="btn-secondary">Share on Farcaster</button>
        <button class="btn-text">Deploy Another Contract</button>
      </div>
    </div>
  </main>
</div>
```

## Elementos de Identidade Visual

### Logo
- Combinação de elementos que representam:
  - HyperEVM (símbolo de blockchain/smart contract)
  - Deploy (símbolo de upload/lançamento)
  - Cores da Hyperliquid

### Ícones
- Estilo: Linha fina com preenchimento sólido para estados ativos
- Tamanho base: 24px
- Cor: #97fbe3 para ícones interativos, #ffffff para ícones informativos

### Ilustrações
- Estilo minimalista com linhas finas
- Cores: Gradientes sutis usando a paleta principal
- Temas: Contratos, blockchain, deploy, carteiras

## Animações e Transições

### Transições de Página
- Fade in/out suave (300ms)
- Slide para transições direcionais

### Microinterações
- Botões: Leve elevação e mudança de escala no hover
- Inputs: Highlight suave ao focar
- Notificações: Entrada deslizante, saída com fade

### Loaders
- Spinner circular com as cores da Hyperliquid
- Barras de progresso para operações de longa duração

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(151, 251, 227, 0.3);
  border-top: 4px solid #97fbe3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Responsividade

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Adaptações para Mobile
- Navegação simplificada
- Cards em layout de coluna única
- Tamanhos de fonte reduzidos
- Espaçamento otimizado
- Inputs maiores para facilitar o toque

### Layout Fluido
- Uso de unidades relativas (rem, %, vh/vw)
- Grid e Flexbox para layouts adaptáveis
- Imagens responsivas com aspect-ratio preservado

## Acessibilidade

### Contraste
- Relação de contraste mínima de 4.5:1 para texto normal
- Relação de contraste mínima de 3:1 para texto grande e elementos gráficos

### Navegação por Teclado
- Foco visível e destacado em todos os elementos interativos
- Ordem de tabulação lógica e consistente

### Semântica
- Uso apropriado de elementos HTML semânticos
- ARIA labels para elementos complexos
- Textos alternativos para imagens

## Implementação com TailwindCSS

### Configuração do Tema
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'hl-dark': '#072723',
        'hl-dark-mid': '#0e4a40',
        'hl-accent': '#97fbe3',
        'hl-accent-light': '#c9fdf0',
        'success': '#00c853',
        'warning': '#ffd600',
        'error': '#ff3d00',
        'info': '#2196f3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 16px rgba(7, 39, 35, 0.2)',
        'button': '0 4px 8px rgba(151, 251, 227, 0.3)',
      },
    },
  },
  variants: {
    extend: {
      transform: ['hover', 'focus'],
      translate: ['hover', 'focus'],
      boxShadow: ['hover', 'focus'],
    },
  },
  plugins: [],
}
```

### Exemplo de Componente com Tailwind
```jsx
// Button.tsx
import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-hl-accent focus:ring-opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-hl-accent text-hl-dark hover:bg-hl-accent-light hover:translate-y-[-2px] hover:shadow-button',
        secondary: 'bg-transparent text-hl-accent border-2 border-hl-accent hover:bg-hl-accent/10 hover:translate-y-[-2px]',
        text: 'bg-transparent text-hl-accent hover:underline',
      },
      size: {
        sm: 'text-sm py-2 px-4',
        md: 'text-base py-3 px-6',
        lg: 'text-lg py-4 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  children,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

## Próximos Passos

1. **Criação de Assets**:
   - Desenvolver logo e ícones personalizados
   - Preparar ilustrações para as diferentes seções

2. **Implementação de Componentes**:
   - Criar biblioteca de componentes reutilizáveis
   - Implementar estilos Tailwind personalizados

3. **Prototipagem**:
   - Desenvolver protótipos interativos para validação
   - Testar fluxos de usuário e interações

4. **Integração**:
   - Aplicar o design ao código funcional
   - Garantir consistência visual em todas as telas
