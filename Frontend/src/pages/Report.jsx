// src/pages/Report.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing transactions/reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (status) params.status = status;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await api.get("/report/reports", {
        params,
        withCredentials: true,
      });

      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report data.");
    } finally {
      setLoading(false);
    }
  };

  //  Generate new report (POST)
  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        status: status || "ALL",
        startDate,
        endDate,
        fileType: "csv",
      };

      const res = await api.post("/report/generate", payload, {
        withCredentials: true,
      });

      alert(res.data.message || "Report generated successfully!");
      fetchReports(); // refresh
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // Export table to CSV
  const handleExportCSV = () => {
    const csvRows = [];
    const headers = [
      "Book Title",
      "Author",
      "User",
      "Issue Date",
      "Return Date",
      "Status",
      "Fine",
    ];
    csvRows.push(headers.join(","));

    reports.forEach((txn) => {
      csvRows.push(
        [
          txn.book?.title,
          txn.book?.author,
          txn.user?.name,
          new Date(txn.issueDate).toLocaleDateString(),
          txn.returnDate ? new Date(txn.returnDate).toLocaleDateString() : "",
          txn.status,
          txn.fine || 0,
        ].join(",")
      );
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Library_Report.csv";
    a.click();
  };

  // Load reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        📊 Library Reports
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded-md"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="ISSUED">Issued</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded-md"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded-md"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Filter
        </button>

        <button
          onClick={handleGenerateReport}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Generate Report
        </button>

        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reports.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 border">Book Title</th>
                <th className="px-4 py-2 border">Author</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Issue Date</th>
                <th className="px-4 py-2 border">Return Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Fine</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((txn) => (
                <tr key={txn._id} className="text-center">
                  <td className="border px-4 py-2">{txn.book?.title}</td>
                  <td className="border px-4 py-2">{txn.book?.author}</td>
                  <td className="border px-4 py-2">{txn.user?.name}</td>
                  <td className="border px-4 py-2">
                    {new Date(txn.issueDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {txn.returnDate
                      ? new Date(txn.returnDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      txn.status === "ISSUED"
                        ? "text-blue-600"
                        : txn.status === "RETURNED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {txn.status}
                  </td>
                  <td className="border px-4 py-2">₹{txn.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
