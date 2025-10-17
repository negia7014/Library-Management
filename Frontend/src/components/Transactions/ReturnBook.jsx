import React, { useEffect, useState } from "react";
import api from "../../api";

const ReturnBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [bookData, setBookData] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [finePaid, setFinePaid] = useState(false);

  // Fetch issued books
  useEffect(() => {
    api.get("/transaction/issuedBook")
      .then(res => setBooks(res.data.data || []))
      .catch(err => console.error("Error fetching issued books:", err));
  }, []);

  // When book changes, fetch its details (fine, author, etc.)
  useEffect(() => {
    if (selectedBook) {
      api.get(`/transaction/bookDetails/${selectedBook}`)
        .then(res => setBookData(res.data.data))
        .catch(err => console.error("Error fetching book details:", err));
    } else {
      setBookData(null);
    }
  }, [selectedBook]);

  // Confirm Return
  const handleReturn = async () => {
    if (!selectedBook) return alert("Select a book first!");

    try {
      const res = await api.post("/transaction/return", {
        bookId: selectedBook,
        finePaid,
        remarks,
      });
      alert(res.data.message || "Book returned successfully!");
      setSelectedBook("");
      setBookData(null);
      setRemarks("");
      setFinePaid(false);
    } catch (err) {
      console.error(err);
      alert("Error returning book");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[420px]">
        <h2 className="text-xl font-semibold mb-6 text-center border-b pb-2">
          Fine Pay / Return Book
        </h2>

        {/* Book Selector */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Book</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Book --</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        {/* Display Book Info */}
        {bookData && (
          <div className="mb-4 text-gray-800">
            <p><b>Book:</b> {bookData.title}</p>
            <p><b>Author:</b> {bookData.author}</p>
            <p><b>Fine Amount:</b> ₹{bookData.fineAmount || 0}</p>
          </div>
        )}

        {/* Fine Paid Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={finePaid}
            onChange={(e) => setFinePaid(e.target.checked)}
            className="mr-2"
          />
          <label>Fine Paid</label>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks (optional)"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Confirm Return */}
        <button
          onClick={handleReturn}
          className="bg-blue-600 text-white w-full py-2 rounded-full hover:bg-blue-700 transition"
        >
          Confirm Return
        </button>
      </div>
    </div>
  );
};

export default ReturnBook;
