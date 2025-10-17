import React, { useState } from "react";
import api from "../../api"; // Assuming your Axios instance is here

const AddMembership = () => {
  // 🎯 1. FORM STATE UPDATED to match the detailed design and backend controller
  const [form, setForm] = useState({
    firstName: "",      // Matches backend: req.body.firstName
    lastName: "",       // Matches backend: req.body.lastName
    contactName: "",    // Matches backend: req.body.contactName
    contactAddress: "", // Matches backend: req.body.contactAddress
    adadharCardNo: "",  // Matches backend: req.body.adadharCardNo
    // Note: The form design uses radio buttons for duration, but we'll use a single state key.
    membershipDuration: "six months", // Matches backend: req.body.membershipDuration
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added for success message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error/success on change
    setError("");
    setSuccess("");
  };

  const handleSubmit = async() => {
    //MANDATORY FIELDS CHECK UPDATED
    const mandatoryFields = [
      form.firstName, 
      form.lastName, 
      form.adadharCardNo
    ];

    if (mandatoryFields.some(field => !field)) {
      setError("First Name, Last Name, and Adadhar Card No. are mandatory!");
      return;
    }
    
    try {
      //  API CALL REMAINS THE SAME
      const response = await api.post("/maintenance/membership", {
          ...form,
          membershipDuration: form.membershipDuration 
      });

      if (response.status === 201) {
        setSuccess(`Membership successfully added for ${response.data.member.firstName}.`);
        setForm({ // Clear the form after successful submission
            firstName: "", lastName: "", contactName: "", contactAddress: "",
            adadharCardNo: "", membershipDuration: "six months",
        });
        setError(""); 
      }
    } catch (err) {
      console.error("Add Membership Error:", err);
      setSuccess(""); 
      if (err.response) {
        setError(err.response.data.message || "Registration failed. Please check the Aadhaar number.");
      } else {
        setError("Could not connect to the server. Please check your network or backend status.");
      }
    }
  };

  return (
    <div>
      <h3>Add Membership</h3>
      
      {/* First Name */}
      <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} /> <br />
      
      {/* Last Name */}
      <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} /> <br />
      
      {/* Contact Name (Assuming Full Name for correspondence) */}
      <input type="text" name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} /> <br />
      
      {/* Contact Address */}
      <input type="text" name="contactAddress" placeholder="Contact Address" value={form.contactAddress} onChange={handleChange} /> <br />
      
      {/* Aadhaar Card No */}
      <input type="text" name="adadharCardNo" placeholder="Adadhar Card No." value={form.adadharCardNo} onChange={handleChange} /> <br />
      
      
      <label>Membership:</label><br/>
      <input type="radio" id="six_months" name="membershipDuration" value="six months" checked={form.membershipDuration === "six months"} onChange={handleChange} />
      <label htmlFor="six_months">Six Months</label><br/>
      
      <input type="radio" id="one_year" name="membershipDuration" value="One Year" checked={form.membershipDuration === "One Year"} onChange={handleChange} />
      <label htmlFor="one_year">One Year</label><br/>
      
      <input type="radio" id="two_years" name="membershipDuration" value="Two Years" checked={form.membershipDuration === "Two Years"} onChange={handleChange} />
      <label htmlFor="two_years">Two Years</label><br/>
      
      {error && <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>}
      {success && <p style={{ color: "green", fontWeight: "bold" }}>Success: {success}</p>}

      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
};

export default AddMembership;