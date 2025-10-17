import axios from "axios";

// api.js
const api = axios.create({
  baseURL: "/api", // Relative path jo proxy use karega
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
