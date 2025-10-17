import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard">
      <h2>Welcome to LMS Dashboard</h2>
      <div className="menu">
        {role === "admin" && (
          <>
            <Link to="/add-book">Add Book</Link>
            <Link to="/update-book">Update Book</Link>
          </>
        )}
        <Link to="/issue-book">Issue Book</Link>
        <Link to="/return-book">Return Book</Link>
        <Link to="/fine-pay">Pay Fine</Link>
        <Link to="/reports">Reports</Link>
      </div>
    </div>
  );
}
