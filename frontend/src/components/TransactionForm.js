import { useState } from "react";

export default function TransactionForm() {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");

  const sendTransaction = async () => {
    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, value, data }),
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div>
      <h2>Send Gasless Transaction</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <textarea
        placeholder="Data (Optional)"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={sendTransaction}>Send</button>
    </div>
  );
}
