import Link from "next/link";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Gasless Transactions</div>
      <div className={styles.links}>
        <Link href="/">
          <span className={styles.link}>Home</span>
        </Link>
        <Link href="/send">
          <span className={styles.link}>Send Transaction</span>
        </Link>
        <Link href="/history">
          <span className={styles.link}>Transaction History</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
