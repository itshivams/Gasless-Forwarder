import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const TransactionForm = ({ isWalletConnected, walletAddress }: TransactionFormProps) => {
  const [tokenType, setTokenType] = useState<"ERC20" | "ERC721">("ERC20");
  const [contractAddress, setContractAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isWalletConnected) {
      setContractAddress(walletAddress);
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

    let transactionData;
    if (tokenType === "ERC20") {
      if (!amount || isNaN(Number(amount))) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      transactionData = {
        from: walletAddress,
        to: recipient,
        value: amount,
        nonce: 1,
        data: "0x",
        signed: "0xSignedTransactionData", // Replace with actual signed transaction data
        tokenType: "erc20",
      };
    } else if (tokenType === "ERC721") {
      if (!amount || isNaN(Number(amount))) {
        toast({
          title: "Invalid Token ID",
          description: "Please enter a valid token ID",
          variant: "destructive",
        });
        return;
      }

      transactionData = {
        from: walletAddress,
        to: recipient,
        value: "0", // ERC721 usually doesn't have a value
        nonce: 1, 
        data: "0x",
        signed: "0xSignedTransactionData", // Replace with actual signed transaction data
        tokenType: "erc721",
        tokenId: amount, 
      };
    }

    try {
      const response = await fetch("https://backend-hackiitk.itshivam.me/relay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();

      if (data.message) {
        toast({
          title: "Transaction Successful",
          description: `Transaction relayed successfully! Tx Hash: ${data.txHash}`,
          variant: "default",
          style: { backgroundColor: "#026e02", color: "white" }, 
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: "There was an issue with relaying the transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Send Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Token Type
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setTokenType("ERC20")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tokenType === "ERC20"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ERC-20
            </button>
            <button
              type="button"
              onClick={() => setTokenType("ERC721")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tokenType === "ERC721"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ERC-721
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="contractAddress"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Contract Address
          </label>
          <input
            type="text"
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0x..."
            disabled={isWalletConnected}
          />
        </div>

        <div>
          <label
            htmlFor="recipient"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0x..."
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {tokenType === "ERC20" ? "Amount" : "Token ID"}
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={tokenType === "ERC20" ? "0.0" : "#1234"}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Send Transaction
        </button>
      </form>
    </div>
  );
};
