import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../api";
function Register() {
  // Initialize useNavigate hook
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    membership: "6months",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, membership } = formData;

    // Client-side validation
    if (!name || !email || !password || !membership) {
      setError("All fields are mandatory. Please fill everything.");
      return;
    }

    console.log("Attempting registration for:", formData.email);
    setError(""); // Clear previous errors

     try {
      const response = await api.post("/auth/register", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration Error:", err);

      if (err.response) {
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else {
        setError("Could not connect to the server. Please check your network or backend status.");
      }
    }
  };


  return (
    <div className="register-container">
      <div className="register-box">
        <h2>User Registration</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Full Name"
          />
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email"
          />
          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Password"
          />

          {/* Membership Radio Group */}
          <label className="membership-label">Membership Duration:</label>
          <div className="radio-group">
            {/* 6 Months Option */}
            <label className="radio-label">
              <input
                type="radio"
                name="membership"
                value="6months"
                checked={formData.membership === "6months"}
                onChange={handleChange}
              />
              6 Months
            </label>
            {/* 1 Year Option */}
            <label className="radio-label">
              <input
                type="radio"
                name="membership"
                value="1year"
                checked={formData.membership === "1year"}
                onChange={handleChange}
              />
              1 Year
            </label>
            {/* 2 Years Option */}
            <label className="radio-label">
              <input
                type="radio"
                name="membership"
                value="2years"
                checked={formData.membership === "2years"}
                onChange={handleChange}
              />
              2 Years
            </label>
          </div>

          {/* Submit Button - Note: onClick removed, form onSubmit handles the logic */}
          <button type="submit" className="register-button">Register</button>
        </form>
        
        {/* Link to Login Page */}
        <p className="login-prompt">
          Already have an account? <Link to="/login" className="login-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
