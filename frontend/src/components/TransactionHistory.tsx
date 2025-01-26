import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-secondary" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "pending":
      return <AlertCircle className="h-5 w-5 text-primary" />;
    default:
      return null;
  }
};

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  timeStamp: string;
  status: "pending" | "success" | "failed";
}

interface TransactionHistoryProps {
  walletAddress: string;
}

export const TransactionHistory = ({ walletAddress }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-hackiitk.itshivam.me/history?address=${walletAddress}`
      );
      const data = await response.json();

      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(
          data.transactions.map((tx) => ({
            ...tx,
            status: tx.value === "0" ? "pending" : "success",
          }))
        );
      } else {
        setTransactions([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transaction history.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filteredStatus === "all") return true;
    return tx.status === filteredStatus;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <button onClick={fetchTransactions} className="text-gray-700 hover:text-gray-900">
          <RefreshCcw className="h-6 w-6" />
        </button>
      </div>
      
      {!walletAddress ? (
        <p className="text-sm text-gray-500">Connect Wallet First</p>
      ) : loading ? (
        <Skeleton count={5} height={50} className="mb-4" />
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions found.</p>
      ) : (
        <>
          <div className="mb-4 flex space-x-4">
            {["all", "pending", "success", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilteredStatus(status)}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filteredStatus === status ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {paginatedTransactions.map((tx) => (
              <div
                key={tx.hash}
                className="transaction-card flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex items-center space-x-4">
                  <StatusIcon status={tx.status} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.value === "0" ? `NFT Transaction` : `${tx.value} Tokens`}
                    </p>
                    <p className="text-sm text-gray-500">To: {tx.to}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium capitalize text-gray-900">{tx.status}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(parseInt(tx.timeStamp) * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTransaction && (
        <Dialog open={true} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-2xl break-words">
            <DialogTitle>Transaction Details</DialogTitle>
            <div className="space-y-4">
              <p><strong>Hash:</strong><br /> {selectedTransaction.hash}</p>
              <p><strong>From:</strong><br /> {selectedTransaction.from}</p>
              <p><strong>To:</strong><br /> {selectedTransaction.to}</p>
              <p><strong>Gas Used:</strong><br /> {selectedTransaction.gasUsed}</p>
              <p><strong>Value:</strong><br /> {selectedTransaction.value}</p>
              <p><strong>Status:</strong><br /> {selectedTransaction.status}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
