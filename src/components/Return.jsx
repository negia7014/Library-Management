import React, { useState } from "react";
import api from "../api";

export default function ReturnBook() {
  const [serialNo, setSerialNo] = useState("");
  const [message, setMessage] = useState("");

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      await api.post("/transactions/return", { serialNo });
      setMessage("Book returned successfully!");
    } catch {
      setMessage("Error returning book.");
    }
  };

  return (
    <div className="form-box">
      <h3>Return Book</h3>
      <form onSubmit={handleReturn}>
        <input placeholder="Serial No" onChange={(e) => setSerialNo(e.target.value)} required />
        <button type="submit">Return</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
