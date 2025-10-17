/*import React, { useState } from "react";
import api from "../../api";
const FinePay = ({ returnData }) => {
  const [form, setForm] = useState({
    fineAmount: 0,
    finePaid: false,
    remarks: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.fineAmount > 0 && !form.finePaid) {
      setError("Fine must be paid before confirming!");
      return;
    }
    

    alert("Book return transaction completed successfully!");
    setError("");
  };

  return (
    <div>
      <h3>Fine Pay</h3>
      <p><b>Book:</b> {returnData?.title || "N/A"}</p>
      <p><b>Author:</b> {returnData?.author || "N/A"}</p>
      <p><b>Fine Amount:</b> ₹{form.fineAmount}</p>

      <form onSubmit={handleSubmit}>
        <label>Fine Paid:</label>
        <input
          type="checkbox"
          checked={form.finePaid}
          onChange={(e) => setForm({ ...form, finePaid: e.target.checked })}
        /><br />
        <textarea
          name="remarks"
          placeholder="Remarks (optional)"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        /><br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Confirm Return</button>
      </form>
    </div>
  );
};

export default FinePay;
*/