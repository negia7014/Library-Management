import React from "react";
import { Link, Routes, Route } from "react-router-dom"
import Transaction from "./Transaction";
import Report from "./Report";
import Navbar from "./Navbar";
const UserPage = () => {
  return (
    <div>
      <Navbar/>
     <h1>Welcome To The User Home Page</h1>
      <h3>Categorires Of Books</h3>
      {/* Main navigation */}
      <nav>
        <Link to="transaction" style={{ margin: "10px" }}>Transaction</Link>
        <Link to="report" style={{ margin: "10px" }}>Report</Link>
      </nav>

      {/* Nested routes */}
      <Routes>
        <Route path="transaction/*" element={<Transaction />} />
        <Route path="report" element={<Report />} />
      </Routes>
    </div>
  );
};

export default UserPage;
