import { useState } from "react";
import TransactionForm from "../components/TransactionForm";

export default function Home() {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>Gasless Transaction Forwarder</h1>
            <TransactionForm />
        </div>
    );
}
