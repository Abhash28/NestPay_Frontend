import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <nav>
        <h1>Admin Dashboard</h1>
        <Link to="/property">Property</Link>
        
      </nav>
    </>
  );
};

export default AdminDashboard;
