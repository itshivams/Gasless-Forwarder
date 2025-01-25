import { useState } from "react";
import { ethers } from "ethers";
import { sendGaslessTransaction } from "../utils/forwarder";

export default function TransactionForm() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (!window.ethereum) {
            alert("MetaMask is required!");
            return;
        }

        setLoading(true);
        try {
            const response = await sendGaslessTransaction(recipient, amount);
            alert(`Transaction submitted: ${response.txHash}`);
        } catch (error) {
            console.error(error);
            alert("Transaction failed!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Send Gasless Transaction"}
            </button>
        </form>
    );
}
