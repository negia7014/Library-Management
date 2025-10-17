import React, { useState } from "react";
import api from "../api";

export default function IssueBook() {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const issueBook = async (e) => {
    e.preventDefault();
    if (!bookName) return setMessage("Book name required!");
    try {
      await api.post("/transactions/issue", { bookName });
      setMessage("Book issued successfully!");
    } catch {
      setMessage("Error issuing book.");
    }
  };

  return (
    <div className="form-box">
      <h3>Issue Book</h3>
      <form onSubmit={issueBook}>
        <input placeholder="Book Name" onChange={(e) => setBookName(e.target.value)} />
        <input placeholder="Author (auto)" value={author} readOnly />
        <button type="submit">Issue</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
