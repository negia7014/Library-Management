import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import AddBook from "../components/Maintenance/AddBook";
import UpdateBook from "../components/Maintenance/UpdateBook";
import AddMembership from "../components/Maintenance/AddMembership";
import UpdateMembership from "../components/Maintenance/UpdateMembership";
import UserManagement from "../components/Maintenance/UserManagement";

const Maintenance = () => {
  return (
    <div>
      <h3>Maintenance Menu</h3>
      <nav>
        <Link to="add-book" style={{ margin: "5px" }}>Add Book</Link>
        <Link to="update-book" style={{ margin: "5px" }}>Update Book</Link>
        <Link to="add-membership" style={{ margin: "5px" }}>Add Membership</Link>
        <Link to="update-membership" style={{ margin: "5px" }}>Update Membership</Link>
        <Link to="user-management" style={{ margin: "5px" }}>User Management</Link>
      </nav>

      <Routes>
        <Route path="add-book" element={<AddBook />} />
        <Route path="update-book" element={<UpdateBook />} />
        <Route path="add-membership" element={<AddMembership />} />
        <Route path="update-membership" element={<UpdateMembership />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route index element={<h4>Select a Maintenance option</h4>} />
      </Routes>
    </div>
  );
};

export default Maintenance;
