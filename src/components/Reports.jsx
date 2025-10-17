import React, { useEffect, useState } from "react";
import api from "../api";

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading reports...</p>;

  return (
    <div className="report-box">
      <h3>📊 Library Reports</h3>
      <ul>
        <li>Total Books: {data.totalBooks}</li>
        <li>Issued Books: {data.issuedBooks}</li>
        <li>Returned Books: {data.returnedBooks}</li>
        <li>Active Memberships: {data.activeMemberships}</li>
        <li>Pending Fines: {data.pendingFines}</li>
      </ul>
    </div>
  );
}
