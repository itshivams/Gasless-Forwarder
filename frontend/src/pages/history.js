import React from "react";
import styles from "../styles/history.module.css";

const History = () => {
  const transactions = [
    { id: 1, name: "Alice", amount: "$200", date: "2025-01-20" },
    { id: 2, name: "Bob", amount: "$150", date: "2025-01-21" },
    { id: 3, name: "Charlie", amount: "$300", date: "2025-01-22" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Transaction History</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>ID</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Amount</th>
            <th className={styles.tableHeader}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{transaction.id}</td>
              <td className={styles.tableCell}>{transaction.name}</td>
              <td className={styles.tableCell}>{transaction.amount}</td>
              <td className={styles.tableCell}>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
