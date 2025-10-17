import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password ,role});
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      switch(res.data.user.role){
        case 'admin':
          navigate("/admin");
          break;
        case 'user':
          navigate("/user");
          break;
        default:
          navigate("/user")
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

return (
  <div className="login-page">
    <div className="login-box">
      <h2>Library Management System</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  </div>
);

};