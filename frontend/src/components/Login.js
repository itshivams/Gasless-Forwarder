import { useState, useEffect } from "react";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState("");

  // Function to connect the wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);

        // Store wallet address in local storage for persistence
        localStorage.setItem("walletAddress", accounts[0]);
      } catch (error) {
        console.error("User denied wallet connection", error);
      }
    } else {
      alert("Please install MetaMask or a Web3-compatible wallet.");
    }
  };

  // Check if the wallet is already connected (after page reload)
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  return (
    <div className="login-container">
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
      </button>

      {walletAddress && (
        <div>
          <p>Wallet Address: {walletAddress}</p>
          <a href="/send">Proceed to Send Transaction</a>
        </div>
      )}
    </div>
  );
}
