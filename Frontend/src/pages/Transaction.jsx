import React, { useState } from "react";
import BookAvailable from "../components/Transactions/BookAvailable";
import BookIssue from "../components/Transactions/BookIssue";
import ReturnBook from "../components/Transactions/ReturnBook";


const Transaction = ({ role }) => {
  const [activePage, setActivePage] = useState("");

  const renderPage = () => {
    switch (activePage) {
      case "BookAvailable":
        return <BookAvailable />;
      case "BookIssue":
        return <BookIssue />;
      case "ReturnBook":
        return <ReturnBook />;
      /*case "FinePay":
        return <FinePay />;*/
      default:
        return <h3>Select a transaction action from the menu</h3>;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Transaction Section</h2>

      {/* Menu Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActivePage("BookAvailable")}
          style={{ marginRight: "10px" }}
        >
          Book Available
        </button>
        <button
          onClick={() => setActivePage("BookIssue")}
          style={{ marginRight: "10px" }}
        >
          Book Issue
        </button>
        <button
          onClick={() => setActivePage("ReturnBook")}
          style={{ marginRight: "10px" }}
        >
          Return Book
        </button>
     
      </div>

      {/* Render Selected Subpage */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
};

export default Transaction;
