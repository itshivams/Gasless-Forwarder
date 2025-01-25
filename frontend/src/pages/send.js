import React, { useState } from "react";
import styles from "../styles/send.module.css";

const Send = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && amount) {
      console.log("Data submitted:", { name, amount });
      alert(`Data sent! Name: ${name}, Amount: ${amount}`);
      setName("");
      setAmount("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Send Data</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name" className={styles.label}>
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipient name"
          className={styles.input}
        />

        <label htmlFor="amount" className={styles.label}>
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Send;
