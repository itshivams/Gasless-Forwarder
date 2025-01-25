import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
export default function Main() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Gasless</h1>
      <TransactionForm />
    </div>
  );
}
