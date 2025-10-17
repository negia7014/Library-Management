import React, { useState } from "react";

const BookCategories = ({ role }) => {


  // Sample book categories
  const categories = ["Fiction", "Non-Fiction", "Science", "Comics"];

  // Function to handle menu clicks
  const handleMenuClick = (menu) => {
    alert(`Navigate to ${menu} page`);
  };

  // Function to handle category clicks
  const handleCategoryClick = (category) => {
    alert(`You selected ${category} category`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>Category of Book</h2>

      {/* Role-based Menu */}
      <div style={{ marginBottom: "20px" }}>
        {role === "admin" && (
          <>
            <button
              onClick={() => handleMenuClick("Maintenance")}
              style={{ marginRight: "10px", padding: "10px 20px" }}
            >
              Maintenance
            </button>
            <button
              onClick={() => handleMenuClick("Reports")}
              style={{ marginRight: "10px", padding: "10px 20px" }}
            >
              Reports
            </button>
          </>
        )}
        {role === "user" && (
          <button
            onClick={() => handleMenuClick("Reports")}
            style={{ marginRight: "10px", padding: "10px 20px" }}
          >
            Reports
          </button>
        )}
      </div>

      {/* Book Categories */}
      <div>
        <h3>Select Category</h3>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{ margin: "5px", padding: "10px 15px" }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookCategories;
