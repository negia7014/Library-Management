import React, { useState } from "react";
import api from "../api";

export default function AddBook() {
  const [book, setBook] = useState({ title: "", author: "", serialNo: "", type: "book" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books/add", book);
      setMessage("Book added successfully!");
    } catch {
      setMessage("All fields are required!");
    }
  };

  return (
    <div className="form-box">
      <h3>Add Book</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Book Title" onChange={handleChange} required />
        <input name="author" placeholder="Author" onChange={handleChange} required />
        <input name="serialNo" placeholder="Serial No" onChange={handleChange} required />
        <select name="type" onChange={handleChange}>
          <option value="book">Book</option>
          <option value="movie">Movie</option>
        </select>
        <button type="submit">Add</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
