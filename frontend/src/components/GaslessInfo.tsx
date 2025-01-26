import { useState } from "react";
import Modal from "react-modal";
import { Line } from "react-chartjs-2";
import { Maximize, X } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ETH_PRICE_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
const ETH_HISTORY_API = (days) =>
  `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}`;



interface GaslessInfoProps {
  className?: string;
  account: string;
}

export const GaslessInfo = ({ className = "", account }: GaslessInfoProps) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ethPrice, setEthPrice] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(7);

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
      toast({
        title: "Balance fetched Successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast({
        title: "Error fetching balance",
        description: `Failed to fetch balance. Please try again.`,
        variant: "destructive",
      });
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEthPrice = async () => {
    try {
      const response = await fetch(ETH_PRICE_API);
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  };

  const fetchEthHistory = async () => {
    try {
      const response = await fetch(ETH_HISTORY_API(selectedDays));
      const data = await response.json();
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const times = data.prices.map((price: [number, number]) =>
        new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      setPriceHistory(prices);
      setTimestamps(times);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching ETH price history:", error);
    }
  };

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: `ETH Price (USD) - Last ${selectedDays} Days`,
        data: priceHistory,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">About Gasless Transactions</h2>
      <div className="space-y-4 text-gray-600">
        <p>
          Gasless transactions allow you to send tokens without paying for gas fees. The gas fees are covered by a relayer service.
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
          {loading ? "Fetching Balance..." : "Get Balance"}
        </button>
        <button
          onClick={fetchEthPrice}
          className="mt-4 w-full rounded-lg bg-green-500 px-4 py-2 text-white font-medium hover:bg-green-600 transition duration-200"
        >
          View Current ETH Price
        </button>

        <div className="flex items-center space-x-2 mt-4">
          <select
            className="p-2 border rounded-md"
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
          </select>
          <button
            onClick={fetchEthHistory}
            className="rounded-lg bg-purple-500 px-4 py-2 text-white font-medium hover:bg-purple-600 transition duration-200"
          >
            View ETH Price Graph
          </button>
        </div>

        {ethPrice && <p className="mt-4 text-lg font-semibold">Current ETH Price: ${ethPrice}</p>}
        {balance && (
          <div className="mt-4 p-4 rounded-lg bg-gray-100 text-gray-900">
            <p className="text-lg font-semibold">Balance: {balance} ETH</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className={`fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50`}
      >
        <div
          className={`bg-white p-6 rounded-lg shadow-lg transition-all ${
            isFullscreen ? "w-full h-full" : "w-3/4 max-w-3xl"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">ETH Price History</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                <Maximize size={20} />
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="h-96">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
