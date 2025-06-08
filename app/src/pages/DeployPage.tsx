import React from 'react';
import '../styles/tailwind.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import sdk from '@farcaster/frame-sdk';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const PREDEFINED_BYTECODE = '0x6080604052348015600e575f5ffd5b...'; // Truncado aqui por brevidade

const DeployPage: React.FC = () => {
  const [estimatedGas] = React.useState('180,000');
  const [estimatedCost] = React.useState('0.0018');
  const [remainder] = React.useState('0.0012');

  const [currentChainId, setCurrentChainId] = React.useState<number | null>(null);
  const [userAddress, setUserAddress] = React.useState<string | null>(null);
  const [userBalance, setUserBalance] = React.useState<string>('0');
  const [isCorrectNetwork, setIsCorrectNetwork] = React.useState(false);

  const [txHash, setTxHash] = React.useState('');
  const [deployedAddress, setDeployedAddress] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isDeploying, setIsDeploying] = React.useState(false);

  const checkWalletStatus = async () => {
    if (!window.ethereum) return;

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balanceBigInt = await provider.getBalance(address);

    const balanceEth = parseFloat(formatEther(balanceBigInt));

    setCurrentChainId(Number(network.chainId));
    setUserAddress(address);
    setUserBalance(balanceEth.toFixed(4));
    setIsCorrectNetwork(Number(network.chainId) === 12121); // HyperEVM
  };

  React.useEffect(() => {
    checkWalletStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkWalletStatus);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.error('Farcaster SDK didn’t initialize:', e);
      }
    };
    init();
  }, []);

  const deployContract = async () => {
  setErrorMsg('');
  setIsDeploying(true);

  try {
    const result = await sdk.actions.sendToken({
      token: 'eip155:12121/ether', // HyperEVM native token (HYPE), se não for ERC-20
      amount: '3000000000000000', // 0.003 HYPE em wei
      recipientAddress: '0x29Dc8d4ccE7CF167439bC88e401bD1b7A5f076FD'
    });

    if (result.success) {
      console.log("TX:", result.send.transaction);
      setTxHash(result.send.transaction);
      setDeployedAddress('Pending...'); // Você pode atualizar isso depois
    } else {
      setErrorMsg(result.reason || 'Failed to send token.');
      console.error("SendToken error:", result);
    }

  } catch (err: any) {
    console.error('Unexpected error:', err);
    setErrorMsg(err.message || 'Unexpected error.');
  } finally {
    setIsDeploying(false);
  }
};



  return (
    <div className="min-h-screen bg-hl-dark text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-hl-accent rounded-full mr-3"></div>
          <h1 className="text-2xl font-bold">Hyperploy</h1>
        </div>
      </header>

      <main>
        <Card className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Deploy Your Contract</h2>

          <div className="bg-hl-dark/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Deployment Information</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Gas:</span>
                <span>{estimatedGas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Cost:</span>
                <span>0.003 HYPE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Cost:</span>
                <span>{estimatedCost} HYPE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Remainder:</span>
                <span>{remainder} HYPE</span>
              </div>
            </div>
          </div>

          <Button
            onClick={deployContract}
            className={!isCorrectNetwork ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={!isCorrectNetwork}
          >
            Deploy Contract
          </Button>

          {!isCorrectNetwork && (
            <p className="mt-2 text-yellow-400 text-sm">
              ⚠️ Please switch to the <strong>HyperEVM</strong> network.
            </p>
          )}

          {errorMsg && (
            <div className="mt-4 text-red-400 text-sm bg-red-800/20 p-3 rounded-lg border border-red-500">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {isDeploying && (
            <div className="mt-4 text-sm text-yellow-300 animate-pulse">
              Deploying contract… please wait.
            </div>
          )}

          {txHash && (
            <div className="mt-6 text-sm">
              <p className="text-gray-300">
                <strong>Transaction Hash:</strong>{' '}
                <a
                  href={`https://www.hyperscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hl-accent underline"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Deployed At:</strong> <span className="text-hl-accent">{deployedAddress}</span>
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default DeployPage;
