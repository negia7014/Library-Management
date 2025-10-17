import React, { useState } from "react";
import api from "../../api";
const AddBook = () => {
  const [form, setForm] = useState({
    type: "book",
    title: "",
    author: "",
    genre: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.genre) {
      setError("All fields are mandatory!");
      return;
    }
     try {
      const response = await api.post("/maintenance/book", form);

      if (response.status === 200 || response.status === 201) {
        alert(` ${form.type === "book" ? "Book" : "Movie"} added successfully!`);
        setError("");
      }
    } catch (err) {
      console.error("Added Book Error", err);

      if (err.response) {
        setError(err.response.data.message || "Book Addition failed. Pleas try Again.");
      } else {
        setError("Could not connect to the server. Please check your network or backend status.");
      }
    }
    
  };

  return (
    <div>
      <h3>Add Book</h3>
      <form onSubmit={handleSubmit}>
        <label>Type:</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="book">Book</option>
          <option value="movie">Movie</option>
        </select><br />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        /><br />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
        /><br />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        /><br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default AddBook;
