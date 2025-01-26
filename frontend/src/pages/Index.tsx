import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnection } from "@/components/WalletConnection";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { GaslessInfo } from "@/components/GaslessInfo";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState<Web3Provider | null>(null); 
  const { toast } = useToast();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);
  

  const handleConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        let web3Provider = new Web3Provider(window.ethereum);
  
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
  

        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 11155111) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xAA36A7" }], 
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0xAA36A7",
                    chainName: "Sepolia Test Network",
                    rpcUrls: ["https://sepolia.infura.io/v3/02084dda02bc47f78913a11ea476be56"],
                    nativeCurrency: {
                      name: "SepoliaETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  },
                ],
              });
            } else {
              throw switchError;
            }
          }
        }
  
        setProvider(web3Provider);
        setWalletAddress(address);
        setIsConnected(true);
  
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)} on Sepolia`,
          style: { backgroundColor: "#026e02", color: "white" },
        });
  
        window.ethereum.on("chainChanged", async () => {
          toast({
            title: "Network Changed",
            description: "Please reconnect your wallet.",
            variant: "default",
          });
  
          setProvider(new Web3Provider(window.ethereum));
        });
  
      } catch (error) {
        console.error("Connection Error:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No Wallet Detected",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive",
      });
    }
  };
  
  
  

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Gasless Forwarder
          </h1>
          <p className="text-lg text-gray-600">
            Send tokens without paying for gas
          </p>
        </header>

        <div className="mb-8">
          <WalletConnection
            isConnected={isConnected}
            walletAddress={walletAddress}
            onConnect={handleConnect}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <TransactionForm 
              isWalletConnected={isConnected} 
              walletAddress={walletAddress} 
              provider={provider} 
            />
            <GaslessInfo className="mt-8" account={walletAddress}/>
          </div>
          <TransactionHistory walletAddress={walletAddress} />
        </div>
      </div>
    </div>
  );
};

export default Index;
