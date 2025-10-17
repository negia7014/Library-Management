import React, { useState, useEffect } from "react";
import api from "../../api"; 

const UserManagement = () => {
  // State for controlling the UI mode: 'new' or 'existing'
  const [userMode, setUserMode] = useState("new");
  
  // State for user ID when updating an existing user
  const [userId, setUserId] = useState("");
  
  // Form State: Includes all fields shown in the design
  const [form, setForm] = useState({
    name: "",
    statusActive: true, 
    isAdmin: false,     
    // Note: Password/Email fields would be added here for a complete "New User" form
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError("");
    setSuccess("");
  };

  // Switch between New User and Existing User modes
  const handleModeChange = (mode) => {
    setUserMode(mode);
    setUserId(""); // Clear ID when switching mode
    // Reset form to default/empty state
    setForm({ name: "", statusActive: true, isAdmin: false });
    setError("");
    setSuccess("");
  };
  
  // Reset form and messages
  const resetForm = () => {
    setForm({ name: "", statusActive: true, isAdmin: false });
    setUserId("");
    setError("");
    setSuccess("");
  };

  // --- Load Existing User Data (for Update Mode) ---
  useEffect(() => {
    if (userMode === 'existing' && userId) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          // Assuming an API endpoint to fetch user data
         const response = await api.get(`/maintenance/user/${userId}`);
          const userData = response.data.user|| response.data;

          setForm({
            name: userData.name || "",
            statusActive: userData.statusActive === undefined ? true : userData.statusActive,
            isAdmin: userData.isAdmin || false,
          });
          setError("");
          setSuccess("");
        } catch (err) {
          console.error("Load User Error:", err);
          setError("User not found or failed to load. Check the ID.");
          setForm({ name: "", statusActive: true, isAdmin: false });
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [userMode, userId]);


  // --- Submit Logic (Add or Update) ---
  const handleSubmit = async () => {
    // Basic validation
    if (userMode === 'new' && !form.name.trim()) {
      setError("Name is required for a new user!");
      return;
    }
    if (userMode === 'existing' && (!userId || !form.name.trim())) {
      setError("User ID and Name are required for update!");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      
      if (userMode === 'new') {
        // API for adding a new user (POST request)
        response = await api.post("/maintenance/user", form);
        setSuccess(`New staff user "${form.name}" added successfully!`);
        
      } else {
        // API for updating an existing user 
       response = await api.put(`maintenance/user/${userId}`, form);
        setSuccess(`User ID ${userId} updated successfully!`);
      }
      
      // Reset form and UI after successful operation
      if (response.status === 200 || response.status === 201) {
          setForm({ name: response.data.user.name|| response.data.name, statusActive: response.data.user.statusActive, isAdmin: response.data.user.isAdmin });
      }

    } catch (err) {
      console.error("User Management Error:", err);
      setError(err.response?.data?.message || `Operation failed. Check network or server status.`);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Component ---
  return (
    <div style={{ margin: "20px" }}>
      <h3>User Management</h3>
      
      {/* Mode Selection (Radio Buttons from Design) */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '20px' }}>
          <input 
            type="radio" 
            name="userMode" 
            checked={userMode === 'new'} 
            onChange={() => handleModeChange('new')}
          /> New User 
        </label>
        <label>
          <input 
            type="radio" 
            name="userMode" 
            checked={userMode === 'existing'} 
            onChange={() => handleModeChange('existing')}
          /> Existing User 
        </label>
      </div>

      {userMode === 'existing' && (
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Enter User ID to Load" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={() => {
              // Using the simpler load function name from the useEffect:
              if (userId) {
                  // Trigger the fetch by updating the state, which useEffect watches
                  setUserMode('existing'); 
                  // If not using useEffect, directly call the fetch function logic here:
                  // fetchUserData(); 
              }
          }} disabled={loading}>
              Load User
          </button>
        </div>
      )}
      
      {/* Main Form Fields */}
      <div style={{ border: '1px solid #ccc', padding: '20px', maxWidth: '400px' }}>
        <p>Name:</p>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={handleChange} 
          disabled={loading}
        /><br /><br />
        
        {/* Status Checkbox */}
        <p>Status:</p>
        <label>
          <input 
            type="checkbox" 
            name="statusActive" 
            checked={form.statusActive} 
            onChange={handleChange} 
            disabled={loading}
          /> Active
        </label><br /><br />
        
        {/* Admin Checkbox */}
        <p>Admin:</p>
        <label>
          <input 
            type="checkbox" 
            name="isAdmin" 
            checked={form.isAdmin} 
            onChange={handleChange} 
            disabled={loading}
          /> Admin
        </label><br /><br />
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={resetForm} disabled={loading} style={{ marginRight: '10px' }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading}>Confirm</button>
      </div>

      {/* Messages */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>}
      {success && <p style={{ color: "green", fontWeight: "bold" }}>Success: {success}</p>}
    </div>
  );
};

export default UserManagement;