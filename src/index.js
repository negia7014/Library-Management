// index.js
import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";        // aapka main component
import "./index.css";           // global styles

// Root element ko select karo
const root = ReactDOM.createRoot(document.getElementById("root"));

// React app render karo
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
