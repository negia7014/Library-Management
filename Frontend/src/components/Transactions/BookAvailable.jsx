import React, { useEffect, useState } from "react";
 import api from "../../api"; 

const BookAvailability = () => {
  const [books, setBooks] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [result, setResult] = useState("");



useEffect(() => {
  api
    .get("/books/getBooks")
    .then((res) => {
      console.log("Books API response:", res.data);
      // Response structure handle
      if (Array.isArray(res.data.data)) {
        setBooks(res.data.data);
      } else {
        setBooks([]);
      }
    })
    .catch((err) => {
      console.error("Error fetching books:", err);
      setBooks([]);
    });
}, []);



  const handleSearch = async () => {
    if (!selectedTitle || !selectedAuthor) {
      setResult("Please select both title and author.");
      return;
    }

    try {
      const res = await api.get(
        `/books/checkAvailable?title=${selectedTitle}&author=${selectedAuthor}`
      );
      setResult(res.data.message || "Book availability checked.");
    } catch (error) {
      console.error(error);
      setResult("Error checking availability.");
    }
  };

  // Extract unique titles and authors
  const titles = [...new Set(books.map((b) => b.title))];
  const authors = [...new Set(books.map((b) => b.author))];

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 h-screen">
      <h2 className="text-2xl font-semibold mb-4">📚 Book Availability</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Enter Book Name</label>
          <select
            className="w-full border rounded p-2"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <option value="">Select Book</option>
            {titles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Enter Author</label>
          <select
            className="w-full border rounded p-2"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            onClick={() => window.history.back()}
          >
            Back
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {result && (
          <div className="mt-4 text-center font-medium text-gray-700">
            {result}
          </div>
        )}
      </div>

      <button
        className="mt-6 text-red-600 underline"
        onClick={() => alert("Logged out")}
      >
        Log Out
      </button>
    </div>
  );
};

export default BookAvailability;
