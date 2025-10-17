import React, { useState } from "react";
import api from "../api";

export default function FinePay() {
  const [serialNo, setSerialNo] = useState("");
  const [finePaid, setFinePaid] = useState(false);
  const [message, setMessage] = useState("");

  const handleFine = async (e) => {
    e.preventDefault();
    try {
      await api.post("/transactions/fine", { serialNo, finePaid });
      setMessage("Fine processed successfully!");
    } catch {
      setMessage("Error processing fine.");
    }
  };

  return (
    <div className="form-box">
      <h3>Pay Fine</h3>
      <form onSubmit={handleFine}>
        <input placeholder="Serial No" onChange={(e) => setSerialNo(e.target.value)} required />
        <label>
          <input type="checkbox" checked={finePaid} onChange={() => setFinePaid(!finePaid)} />
          Fine Paid
        </label>
        <button type="submit">Confirm</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
