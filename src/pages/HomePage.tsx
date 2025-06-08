import React from 'react';
import '../styles/tailwind.css';

const HomePage: React.FC = () => {
  const handleConnectWallet = () => {
    // Simulação de conexão de carteira
    console.log('Connecting wallet');
    // Aqui seria a integração real com o SDK do Farcaster
    window.location.href = '/deploy';
  };

  return (
    <div className="min-h-screen bg-hl-dark text-white">
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-hl-accent rounded-full mr-3"></div>
          <h1 className="text-2xl font-bold">Hyperploy</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Deploy Smart Contracts on HyperEVM</h2>
          <p className="text-xl text-gray-300 mb-8">Simple, affordable, and secure contract deployment with automatic fee optimization.</p>
          <button 
            onClick={handleConnectWallet}
            className="bg-hl-accent text-hl-dark font-semibold py-3 px-8 rounded-lg hover:bg-hl-accent-light hover:translate-y-[-2px] transition-all hover:shadow-button"
          >
            Start Deploying
          </button>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-hl-dark-mid rounded-xl p-6 border border-hl-accent/10">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Cost Capped at 0.003 HYPE</h3>
            <p className="text-gray-300">Never worry about unexpected gas fees.</p>
          </div>
          
          <div className="bg-hl-dark-mid rounded-xl p-6 border border-hl-accent/10">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Automatic Remainder</h3>
            <p className="text-gray-300">Unused funds are automatically sent to the designated address.</p>
          </div>
          
          <div className="bg-hl-dark-mid rounded-xl p-6 border border-hl-accent/10">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Deployment</h3>
            <p className="text-gray-300">Safe and verified contract deployment process.</p>
          </div>
        </section>
      </main>
      
      <footer className="text-center p-6 text-gray-400">
        <p>Powered by RodrigoPorsh</p>
      </footer>
    </div>
  );
};

export default HomePage;
