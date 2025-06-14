import React from 'react';
import '../styles/tailwind.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { parseEther } from 'ethers';
import sdk from '@farcaster/frame-sdk';

export const PREDEFINED_BYTECODE = "0x6080604052348015600e575f5ffd5b506101268061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c80633fa4f24514603457806360fe47b114604e575b5f5ffd5b603a6066565b60405160459190608a565b60405180910390f35b606460048036038101906060919060ca565b606b565b005b5f5481565b805f8190555050565b5f819050919050565b6084816074565b82525050565b5f602082019050609b5f830184607d565b92915050565b5f5ffd5b60ac816074565b811460b5575f5ffd5b50565b5f8135905060c48160a5565b92915050565b5f6020828403121560dc5760db60a1565b5b5f60e78482850160b8565b9150509291505056fea26469706673582212206dba4cc3b7cf7194f080fb70fd7cc0f7dd233c112fc2407044943b89a267706864736f6c634300081e0033";

const DeployPage: React.FC = () => {
  const [estimatedGas] = React.useState('180,000');
  const [estimatedCost] = React.useState('0.0018');
  const [remainder] = React.useState('0.0012');

  const [currentChainId, setCurrentChainId] = React.useState<number | null>(null);
  const [userAddress, setUserAddress] = React.useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = React.useState(false);

  const [txHash, setTxHash] = React.useState('');
  const [deployedAddress, setDeployedAddress] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isDeploying, setIsDeploying] = React.useState(false);

  const checkWalletStatus = async () => {
    try {
      const providerGetter = sdk.wallet?.getEthereumProvider;
        if (typeof providerGetter !== "function") {
          throw new Error("Farcaster Ethereum provider não disponível.");
        }

        const provider = await providerGetter();
        if (!provider?.request) {
          throw new Error("Farcaster Ethereum provider não suporta requisições.");
        }

      const accounts: readonly `0x${string}`[] = await provider.request({
        method: 'eth_accounts',
      });


      if (accounts.length === 0) {
        setUserAddress(null);
      } else {
        setUserAddress(accounts[0]);
      }

      const chainIdHex: string = await provider.request({
        method: 'eth_chainId',
      });

      const chainId = parseInt(chainIdHex, 16);
      setCurrentChainId(chainId);
      setIsCorrectNetwork(chainId === 12121);
    } catch (error) {
      console.error("Erro ao checar carteira:", error);
      setUserAddress(null);
      setIsCorrectNetwork(false);
    }
  };

  React.useEffect(() => {
  const init = async () => {
    console.log('SDK object:', sdk);
    console.group('SDK Debug');
console.log('sdk imported as:', sdk);
console.log('sdk.wallet:', sdk.wallet);
console.log('sdk.wallet.getEthereumProvider:', sdk.wallet?.getEthereumProvider);
console.groupEnd();


    try {
      const isMiniApp = await sdk.isInMiniApp();
      if (!isMiniApp) {
        throw new Error("Este recurso só funciona dentro do Farcaster Mini App.");
      }

      await sdk.actions.ready({ disableNativeGestures: true });
      checkWalletStatus();
    } catch (e) {
      console.error('Erro ao inicializar SDK:', e);
    }
  };
  init();
}, []);


  const deployContract = async () => {
    setErrorMsg('');
    setIsDeploying(true);

    try {
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider?.request) throw new Error("Carteira não conectada");

      const from = userAddress;
      const to = '0x29Dc8d4ccE7CF167439bC88e401bD1b7A5f076FD';
      const value = '0xAA87BE'; // 0.003 HYPE em hexadecimal (3000000000000000)
      const data = '0x2e64cec1' + PREDEFINED_BYTECODE.slice(2);

      const result = await provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: userAddress as `0x${string}`,
          to: '0x29Dc8d4ccE7CF167439bC88e401bD1b7A5f076FD',
          value: '0xaa87bee538000', // 0.003 em wei = 3 * 10^15
          data: ('0x2e64cec1' + PREDEFINED_BYTECODE.slice(2)) as `0x${string}`,
        }
      ]
    });

      setTxHash(result);
      setDeployedAddress('Pending...');
    } catch (err: any) {
      console.error('Erro ao fazer deploy:', err);
      setErrorMsg(err.message || 'Erro desconhecido.');
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

          <Button onClick={deployContract}>
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
