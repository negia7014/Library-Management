import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddBook from "./components/AddBook";
import UpdateBook from "./components/UpdateBook";
import IssueBook from "./components/IssueBook";
import ReturnBook from "./components/Return";
import FinePay from "./components/FinePay";
import Reports from "./components/Reports";
import Register from "./components/Register";
import BookCategories from "./components/BookCategories"


export default function App() {
  // Role should ideally come from login/session
  const userRole = "admin"; // or "user"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/update-book" element={<UpdateBook />} />
        <Route path="/issue-book" element={<IssueBook />} />
        <Route path="/return-book" element={<ReturnBook />} />
        <Route path="/fine-pay" element={<FinePay />} />
        <Route path="/reports" element={<Reports />} />
        {/* CategoryOfBook with role prop */}
        <Route
          path="/category"
          element={<BookCategories role={userRole} />}
        />
        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
