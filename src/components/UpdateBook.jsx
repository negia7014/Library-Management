import React, { useState } from "react";
import api from "../api";

export default function UpdateBook() {
  const [id, setId] = useState("");
  const [fields, setFields] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, fields);
      setMessage("Book updated successfully!");
    } catch {
      setMessage("Error updating book.");
    }
  };

  return (
    <div className="form-box">
      <h3>Update Book</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Book ID" onChange={(e) => setId(e.target.value)} required />
        <input name="title" placeholder="New Title" onChange={handleChange} />
        <input name="author" placeholder="New Author" onChange={handleChange} />
        <button type="submit">Update</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
