import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import api from "../api";
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await api("/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("token");
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

 const handleHomeClick = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">📚 Library Management</span>
      </div>

      <div className="navbar-center">
        <button className="nav-link" onClick={handleHomeClick}>Home</button>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
