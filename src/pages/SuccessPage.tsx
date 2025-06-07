import React from 'react';
import '../styles/tailwind.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SuccessPage: React.FC = () => {
  // Simulação de dados de deploy bem-sucedido
  const contractAddress = "0xabcd1234abcd1234abcd1234abcd1234abcd1234";
  const transactionHash = "0xefgh5678efgh5678efgh5678efgh5678efgh5678";
  const actualCost = "0.0017";
  const remainder = "0.0013";
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        // Aqui poderia mostrar uma notificação de sucesso
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const handleViewExplorer = () => {
    window.open(`https://explorer.hyperliquid.xyz/address/${contractAddress}`, '_blank');
  };
  
  const handleShare = () => {
    // Simulação de compartilhamento no Farcaster
    console.log('Sharing on Farcaster');
    // Aqui seria a integração real com o SDK do Farcaster
  };
  
  return (
    <div className="min-h-screen bg-hl-dark text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-hl-accent rounded-full mr-3"></div>
          <h1 className="text-2xl font-bold">Hyperploy</h1>
        </div>
        <div className="px-4 py-2 bg-hl-dark-mid rounded-lg border border-hl-accent/20">
          <span className="text-sm">0x1234...5678</span>
          <span className="ml-2 text-sm text-hl-accent">2.5 HYPE</span>
        </div>
      </header>
      
      <main>
        <Card className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Contract Deployed Successfully!</h2>
          </div>
          
          <div className="bg-hl-dark/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Contract Address:</span>
              <div className="flex items-center">
                <span className="mr-2">{`${contractAddress.substring(0, 6)}...${contractAddress.substring(contractAddress.length - 4)}`}</span>
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => handleCopy(contractAddress)}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Transaction Hash:</span>
              <div className="flex items-center">
                <span className="mr-2">{`${transactionHash.substring(0, 6)}...${transactionHash.substring(transactionHash.length - 4)}`}</span>
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => handleCopy(transactionHash)}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Actual Cost:</span>
              <span>{actualCost} HYPE</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Remainder Sent:</span>
              <span>{remainder} HYPE to 0xC6E5...4409</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={handleViewExplorer}>
              View on Explorer
            </Button>
            <Button 
              variant="secondary"
              onClick={handleShare}
            >
              Share on Farcaster
            </Button>
            <Button 
              variant="text"
              onClick={() => window.location.href = '/'}
            >
              Deploy Another Contract
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SuccessPage;
