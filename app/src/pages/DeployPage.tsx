import React from 'react';
import '../styles/tailwind.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { BrowserProvider, Contract, parseEther } from "ethers";
import { formatEther } from "ethers";



declare global {
  interface Window {
    ethereum?: any;
  }
}


export const PREDEFINED_BYTECODE = "0x6080604052348015600e575f5ffd5b506101268061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c80633fa4f24514603457806360fe47b114604e575b5f5ffd5b603a6066565b60405160459190608a565b60405180910390f35b606460048036038101906060919060ca565b606b565b005b5f5481565b805f8190555050565b5f819050919050565b6084816074565b82525050565b5f602082019050609b5f830184607d565b92915050565b5f5ffd5b60ac816074565b811460b5575f5ffd5b50565b5f8135905060c48160a5565b92915050565b5f6020828403121560dc5760db60a1565b5b5f60e78482850160b8565b9150509291505056fea26469706673582212206dba4cc3b7cf7194f080fb70fd7cc0f7dd233c112fc2407044943b89a267706864736f6c634300081e0033"; 

const DeployPage: React.FC = () => {
  const [bytecode, setBytecode] = React.useState('');
  const [estimatedGas, setEstimatedGas] = React.useState('180,000');
  const [estimatedCost, setEstimatedCost] = React.useState('0.0018');
  const [remainder, setRemainder] = React.useState('0.0012');

  const [currentChainId, setCurrentChainId] = React.useState<number | null>(null);
  const [userAddress, setUserAddress] = React.useState<string | null>(null);
  const [userBalance, setUserBalance] = React.useState<string>("0");
  const [isCorrectNetwork, setIsCorrectNetwork] = React.useState(false);

  
  const handleBytecodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBytecode(e.target.value);
  };
  
  const handleDeploy = () => {
    // Simulação do deploy para testes
    console.log('Deploying contract with bytecode:', bytecode);
    // Aqui seria a integração real com o contrato
  };

const [txHash, setTxHash] = React.useState("");
const [deployedAddress, setDeployedAddress] = React.useState("");
const [errorMsg, setErrorMsg] = React.useState("");
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
  setIsCorrectNetwork(Number(network.chainId) === 12121); // Substitua pelo chainId da HyperEVM
};

React.useEffect(() => {
  checkWalletStatus();
  
  // Atualiza automaticamente ao mudar de rede ou conta
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", checkWalletStatus);
    window.ethereum.on("chainChanged", () => window.location.reload());
  }
}, []);

const deployContract = async () => {
  setErrorMsg("");
  setIsDeploying(true);

  if (!window.ethereum) {
    setErrorMsg("Wallet not detected. Please install it or use a browser with Web3 support.");
    setIsDeploying(false);
    return;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = "0x29Dc8d4ccE7CF167439bC88e401bD1b7A5f076FD";
    const contractAbi = [
      "function deployContract(bytes bytecode) external payable returns (address)"
    ];

    const deployer = new Contract(contractAddress, contractAbi, signer);

    const txResponse = await deployer.deployContract(PREDEFINED_BYTECODE, {
      value: parseEther("0.003")
    });

    setTxHash(txResponse.hash);

    const receipt = await txResponse.wait();
    const deployed = await deployer.getAddress?.(); // fallback se disponível
    setDeployedAddress(deployed || "Contract created (address unknown)");
  } catch (error: any) {
    console.error("Deploy error:", error);
    if (error?.info?.error?.message) {
      setErrorMsg(error.info.error.message);
    } else if (error?.message) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg("Unknown error during deployment.");
    }
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
            disabled={!userAddress || !isCorrectNetwork || parseFloat(userBalance) < 0.003}
            className={!userAddress || !isCorrectNetwork || parseFloat(userBalance) < 0.003 ? "opacity-50 cursor-not-allowed" : ""}
          >
            Deploy Contract
          </Button>

          {!userAddress && (
              <p className="mt-2 text-yellow-400 text-sm">⚠️ Connect your wallet to deploy.</p>
            )}

            {userAddress && !isCorrectNetwork && (
              <p className="mt-2 text-yellow-400 text-sm">
                ⚠️ Please switch to the <strong>HyperEVM</strong> network.
              </p>
            )}

            {parseFloat(userBalance) < 0.003 && (
              <p className="mt-2 text-red-400 text-sm">❌ Insufficient balance (you have {userBalance} HYPE)</p>
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
      <strong>Transaction Hash:</strong>{" "}
      <a
        href={`https://www.hyperscan.com/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-hl-accent underline"
      >
        {txHash.slice(0, 10)}...{txHash.slice(-8)}
      </a>
    </p>

    {deployedAddress && (
      <p className="text-gray-300 mt-2">
        <strong>Deployed At:</strong>{" "}
        <span className="text-hl-accent">{deployedAddress}</span>
      </p>
    )}
  </div>

)}

        </Card>
      </main>
    </div>
  );
};

export default DeployPage;
