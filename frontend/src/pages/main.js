import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
export default function Main() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <TransactionForm />
    </div>
  );
}
