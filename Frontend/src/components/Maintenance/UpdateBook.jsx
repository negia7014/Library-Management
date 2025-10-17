import React, { useState } from "react";
import api from "../../api";

const UpdateBook = () => {
  const [bookId, setBookId] = useState("");
  const [form, setForm] = useState({
    type: "book",
    title: "",
    author: "",
    genre: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  //  Load book details by ID
  const loadBook = async () => {
    if (!bookId.trim()) {
      setError("Book ID is required!");
      return;
    }
console.log(`Loading Book ID: ${bookId}`);
    try {
      const response = await api.get(`/maintenance/book/${bookId}`);
      if (response.status === 200) {
        setForm({
          type: response.data.type || "book",
          title: response.data.title || "",
          author: response.data.author || "",
          genre: response.data.genre || "",
        });
        setLoaded(true);
        setError("");
      }
    } catch (err) {
      console.log(`Book ID: ${bookId}`);
      console.error("Load Book Error:", err);
      setError("Book not found. Please check the ID.");
      setLoaded(false);
    }
  };
  // Handle form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update book details
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.genre) {
      setError("All fields are mandatory!");
      return;
    }

    try {
      const response = await api.put(`/maintenance/book/${bookId}`, form);
      if (response.status === 200 || response.status === 201) {
        alert(`${form.type === "book" ? "Book" : "Movie"} updated successfully!`);
        setError("");
      }
    } catch (err) {
      console.error("Update Book Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Book update failed. Please try again.");
      } else {
        setError("Could not connect to the server. Please check your network or backend.");
      }
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Update Book</h3>

      <input
        type="text"
        placeholder="Enter Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={loadBook}>Load</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loaded && (
        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="book">Book</option>
            <option value="movie">Movie</option>
          </select>
          <br /><br />

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          /><br /><br />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
          /><br /><br />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
          /><br /><br />

          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateBook;
