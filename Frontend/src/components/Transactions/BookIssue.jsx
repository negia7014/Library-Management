import React, { useState, useEffect } from "react";
import api from "../../api";
const BookIssue = ({ selectedBook }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    issueDate: "",
    returnDate: "",
    remarks: "",
    borrowerId:"",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedBook) {
      const today = new Date().toISOString().split("T")[0];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 15);
      setForm({
        title: selectedBook.title,
        author: selectedBook.author,
        issueDate: today,
        returnDate: returnDate.toISOString().split("T")[0],
        remarks: "",
        borrowerId: "",
      });
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form.title)
    console.log(form.borrowerId);
    console.log(form.returnDate);
    console.log(form.issueDate);
    if (!form.title || !form.issueDate || !form.returnDate || !form.borrowerId) {
      setError("Please fill all required fields!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.issueDate < today) {
      setError("Issue Date cannot be earlier than today!");
      return;
    }

    const maxReturn = new Date();
    maxReturn.setDate(maxReturn.getDate() + 15);
    if (new Date(form.returnDate) > maxReturn) {
      setError("Return Date cannot be more than 15 days ahead!");
      return;
    }
    try {
      const response = await api.post("/transaction/issue", form);
      if (response.status === 200 || response.status === 201) {
        alert(`Book issued successfully to user!`);
        setError("");
      }
    }
    catch (err) {
      console.error("Booked Issued Error:", err);

      if (err.response) {
        setError(err.response.data.message || "Book Issued failed. Please try again.");
      } else {
        setError("Could not connect to the server. Please check your network or backend status.");
      }
    }
  };

  return (
    <div>
      <h3>Book Issue</h3>
      <form onSubmit={handleSubmit}>
        <label>Borrower ID:</label>
        <input
          type="text"
          name="borrowerId"
          value={form.borrowerId}
          onChange={handleChange}
          placeholder="Borrower ID" 
        /><br />
        <input
          type="text"
          name="title"
          value={form.title}
          // readOnly
          onChange={handleChange}
          placeholder="Book Title"
        /><br />
        <input
          type="text"
          name="author"
          value={form.author}
          //readOnly
          onChange={handleChange}
          placeholder="Author"
        /><br />
        <label>Issue Date:</label>
        <input
          type="date"
          name="issueDate"
          value={form.issueDate}
          onChange={handleChange}
        /><br />
        <label>Return Date:</label>
        <input
          type="date"
          name="returnDate"
          value={form.returnDate}
          onChange={handleChange}
        /><br />
        <textarea
          name="remarks"
          placeholder="Remarks (optional)"
          value={form.remarks}
          onChange={handleChange}
        />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Confirm Issue</button>
      </form>
    </div>
  );
};

export default BookIssue;
