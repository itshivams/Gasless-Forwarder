import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

interface TransactionFormProps {
  isWalletConnected: boolean;
  walletAddress: string;
  provider: Web3Provider | null;
}

const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const TransactionForm = ({ isWalletConnected, walletAddress, provider }: TransactionFormProps) => {
  const [tokenType, setTokenType] = useState<"ERC20" | "ERC721">("ERC20");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isWalletConnected) {
      setRecipient(walletAddress);
    }
  }, [isWalletConnected, walletAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!recipient || !isValidAddress(recipient)) {
      toast({
        title: "Invalid Recipient Address",
        description: "Please enter a valid recipient address",
        variant: "destructive",
      });
      return;
    }
  
    if (!provider) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
  
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) {
      toast({
        title: "Wrong Network",
        description: "Please switch to the Sepolia Test Network.",
        variant: "destructive",
      });
  
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xAA36A7" }], 
        });
      } catch (error) {
        console.error("Error switching network:", error);
        return;
      }
    }
  
    setIsLoading(true);
  
    try {
      const signer = provider.getSigner();
  
      if (tokenType === "ERC20") {
        if (!amount || isNaN(Number(amount))) {
          toast({
            title: "Invalid Amount",
            description: "Please enter a valid amount",
            variant: "destructive",
          });
          return;
        }
  
        const tx = {
          to: recipient,
          value: ethers.parseUnits(amount, "ether"),
        };
  
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();
  
        toast({
          title: "Transaction Successful",
          description: `Transaction confirmed! \nTx Hash: ${txResponse.hash}`,
          variant: "default",
          style: { backgroundColor: "#026e02", color: "white" },
        });
      } else if (tokenType === "ERC721") {
        if (!amount || isNaN(Number(amount))) {
          toast({
            title: "Invalid Token ID",
            description: "Please enter a valid token ID",
            variant: "destructive",
          });
          return;
        }
  
        const erc721Abi = [
          "function safeTransferFrom(address from, address to, uint256 tokenId) public",
        ];
  
        const contractAddress = "0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC"; 
        const tokenId = amount;
  
        const erc721Contract = new ethers.Contract(contractAddress, erc721Abi, signer as unknown as ethers.ContractRunner);
  
        const txResponse = await erc721Contract.safeTransferFrom(walletAddress, recipient, tokenId);
        await txResponse.wait();
  
        toast({
          title: "NFT Transfer Successful",
          description: `NFT transferred successfully! Tx Hash: ${txResponse.hash}`,
          variant: "default",
          style: { backgroundColor: "#026e02", color: "white" },
        });
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "An error occurred during the transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Send Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Token Type</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setTokenType("ERC20")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tokenType === "ERC20" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ERC-20
            </button>
            <button
              type="button"
              onClick={() => setTokenType("ERC721")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tokenType === "ERC721" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ERC-721
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="recipient" className="mb-2 block text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="0x..."
          />
        </div>

        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
            {tokenType === "ERC20" ? "Amount" : "Token ID"}
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder={tokenType === "ERC20" ? "0.0" : "#1234"}
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2 text-white" disabled={isLoading}>
          {isLoading ? "Processing..." : "Send Transaction"}
        </button>
      </form>
    </div>
  );
};