import React, { useEffect, useState } from "react";
import axios from "axios";
import '../admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ requests: 0, categories: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [requestsRes, categoriesRes] = await Promise.all([
        axios.get("/api/admin/partner-requests"),
        axios.get("/api/admin/categories"),
      ]);
      setStats({
        requests: requestsRes.data.length,
        categories: categoriesRes.data.length,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="admin-dashboard">
      <h1>Welcome Admin</h1>
      <div className="stats">
        <div className="card">
          <h3>Partner Requests</h3>
          <p>{2}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p>{10}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
