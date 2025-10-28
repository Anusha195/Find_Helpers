import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-title">Admin Panel</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className="link">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/partner-requests" className="link">
              Partner Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className="link">
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/services" className="link">
              Services
            </NavLink>
          </li>
        </ul>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
