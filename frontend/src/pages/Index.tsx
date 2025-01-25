import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnection } from "@/components/WalletConnection";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { GaslessInfo } from "@/components/GaslessInfo";
import { useToast } from "@/hooks/use-toast";
declare global {
  interface Window {
    ethereum: any;
  }
}
const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();



  const handleConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
  
        setIsConnected(true);
        setWalletAddress(address);
  
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          style: { backgroundColor: "#026e02", color: "white" }, 
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
            Gasless Transactions
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
            <TransactionForm isWalletConnected={isConnected} walletAddress={walletAddress}/>
            <GaslessInfo className="mt-8" />
          </div>
          <TransactionHistory walletAddress={walletAddress} />
        </div>
      </div>
    </div>
  );
};

export default Index;