import { Wallet, Link } from "lucide-react";

interface WalletConnectionProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
}

export const WalletConnection = ({
  isConnected,
  walletAddress,
  onConnect,
}: WalletConnectionProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 shadow-sm">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-gray-700">
            {walletAddress}
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="wallet-button"
        >
          <Link className="mr-2 h-5 w-5" />
          Connect Wallet
        </button>
      )}
    </div>
  );
};