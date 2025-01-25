import Navbar from "../components/Navbar";
import styles from "../styles/TransectionForm.module.css";

export default function TransactionForm() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Welcome to Gasless Transactions</h1>
          <p className={styles.description}>
            Send tokens without paying gas fees using our decentralized
            forwarder.
          </p>
          <ul className={styles.features}>
            <li>Connect your wallet</li>
            <li>Send transactions for ERC-20 and ERC-721 tokens</li>
            <li>View transaction history</li>
          </ul>
        </div>
      </div>
    </>
  );
}
