import React, { useState } from "react";
import api from "../../api"; // Assuming your Axios instance

const UpdateMembership = () => {
  // State for searching
  const [memberId, setMemberId] = useState("");
  
  // State for the form data (matching the comprehensive schema)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactName: "",
    contactAddress: "",
    adadharCardNo: "",
    membershipDuration: "six months",
    active: true, // For status update capability
  });
  
  // State for UI control and messages
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // --- 1. Load Membership details by ID ---
  const loadMembership = async () => {
    if (!memberId.trim()) {
      setError("Member ID is required for searching!");
      setLoaded(false);
      return;
    }
    
    // Reset messages and loaded state
    setError("");
    setSuccess("");
    setLoaded(false);
    
    console.log(`Loading Member ID: ${memberId}`);
    
    try {
      const response = await api.get(`/maintenance/membership/${memberId}`);
      console.log(`Member Id ${memberId}`);
      if (response.status === 200) {
        const memberData = response.data.member || response.data;
        
        // Pre-fill the form with fetched data
        setForm({
          firstName: memberData.firstName || "",
          lastName: memberData.lastName || "",
          contactName: memberData.contactName || "",
          contactAddress: memberData.contactAddress || "",
          // Aadhaar is kept read-only on update, but we load it
          adadharCardNo: memberData.adadharCardNo || "", 
          membershipDuration: memberData.membershipDuration || "six months",
          active: memberData.active,
        });
        setLoaded(true);
      }
    } catch (err) {
      console.error("Load Membership Error:", err);
      setError("Membership not found. Please check the ID.");
      setLoaded(false);
      // Reset form if load fails
      setForm({ firstName: "", lastName: "", contactName: "", contactAddress: "", adadharCardNo: "", membershipDuration: "six months", active: true });
    }
  };
  
  // --- 2. Handle form field changes ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError("");
    setSuccess("");
  };

  // --- 3. Update membership details ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.adadharCardNo) {
      setError("First Name and Aadhaar are mandatory!");
      return;
    }
    
    try {
      // PUT request: /maintenance/membership/:memberId
      const response = await api.put(`/maintenance/membership/${memberId}`, form);
      
      if (response.status === 200) {
        setSuccess(`Membership for ${form.firstName} updated successfully!`);
        setError("");
      }
    } catch (err) {
      console.error("Update Membership Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Membership update failed. Please try again.");
      } else {
        setError("Could not connect to the server. Please check your network or backend.");
      }
      setSuccess("");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Update Membership</h3>

      {/* Member ID Search Section */}
      <input
        type="text"
        placeholder="Enter Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
      />
      <button onClick={loadMembership}>Load Member</button>

      {/* Error and Success Messages */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>}

      {/* Update Form Section (Shown only after data is loaded) */}
      {loaded && (
        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
          
          <p>Editing Member ID: <strong>{memberId}</strong></p>
          
          <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} /><br />
          <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} /><br />
          <input type="text" name="contactName" placeholder="Contact Name" value={form.contactName} onChange={handleChange} /><br />
          <input type="text" name="contactAddress" placeholder="Contact Address" value={form.contactAddress} onChange={handleChange} /><br />
          
          {/* Aadhaar is read-only after loading */}
          <input type="text" name="adadharCardNo" placeholder="Adadhar Card No." value={form.adadharCardNo} readOnly style={{backgroundColor: '#f0f0f0'}} /><br />
          
          {/* Membership Duration (Radio Buttons/Select) */}
          <label>Membership Duration:</label><br/>
          {['six months', 'One Year', 'Two Years'].map((duration) => (
            <React.Fragment key={duration}>
              <input 
                type="radio" 
                id={duration} 
                name="membershipDuration" 
                value={duration} 
                checked={form.membershipDuration === duration} 
                onChange={handleChange} 
              />
              <label htmlFor={duration}>{duration}</label><br/>
            </React.Fragment>
          ))}
          
          {/* Active Status Checkbox */}
          <label htmlFor="active">Membership Active:</label>
          <input type="checkbox" id="active" name="active" checked={form.active} onChange={handleChange} />
          <br /><br />

          <button type="submit">Update Membership</button>
        </form>
      )}
    </div>
  );
};

export default UpdateMembership;