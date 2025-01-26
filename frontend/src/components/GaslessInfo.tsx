import { useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";

interface GaslessInfoProps {
  className?: string;
  account: string;
}

export const GaslessInfo = ({ className = "", account }: GaslessInfoProps) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBalance = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: `Please connect your wallet first.`,
        variant: "destructive",
      });
      return;
    }
   

    setLoading(true);
    try {
      const response = await fetch(`https://backend-hackiitk.itshivam.me/balance?address=${account}`);
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        About Gasless Transactions
      </h2>
      <div className="space-y-4 text-gray-600">
        <p>
          Gasless transactions allow you to send tokens without paying for gas
          fees. The gas fees are covered by a relayer service.
        </p>
        <div>
          <h3 className="mb-2 font-medium text-gray-900">How it works:</h3>
          <ul className="list-inside list-disc space-y-2">
            <li>Connect your wallet</li>
            <li>Enter transaction details</li>
            <li>Sign the message (no gas needed)</li>
            <li>Relayer executes the transaction</li>
          </ul>
        </div>
        <button
          onClick={fetchBalance}
          className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Fetching Balance..." : "View Balance"}
        </button>
        {balance && (
          <div className="mt-4 p-4 rounded-lg bg-gray-100 text-gray-900">
            <p className="text-lg font-semibold">Balance: {balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
};