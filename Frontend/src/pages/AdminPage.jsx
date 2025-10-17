import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Maintenance from "./Maintenance";
import Transaction from "./Transaction";
import Report from "./Report";
import Navbar from "./Navbar";
const AdminPage = () => {
  return (
    <div>
       <Navbar/>
    <h1>Welcome To The Admin Page</h1>
      <h2>Categorires Of Books</h2>
      {/* Main navigation */}
      <nav>
        <Link to="maintenance" style={{ margin: "10px" }}>Maintenance</Link>
        <Link to="transaction" style={{ margin: "10px" }}>Transaction</Link>
        <Link to="report" style={{ margin: "10px" }}>Report</Link>
      </nav>

      {/* Nested routes */}
      <Routes>
        <Route path="maintenance/*" element={<Maintenance />} />
        <Route path="transaction/*" element={<Transaction />} />
        <Route path="report" element={<Report />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
