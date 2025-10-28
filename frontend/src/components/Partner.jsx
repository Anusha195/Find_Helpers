import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../login.css";

const Partner = ({ show, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    categoryId: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/partner/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Failed!", data.message || "Submission failed", "error");
        return;
      }

      Swal.fire({
        title: "Application Submitted 🎉",
        text: "Our team will reach out to you soon.",
        icon: "success",
        confirmButtonText: "Okay",
      });

      setForm({
        fullName: "",
        email: "",
        phone: "",
        categoryId: "",
        city: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error. Please try again later.", "error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>Become a Partner</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <textarea name="description" placeholder="Brief Description" rows="3" value={form.description} onChange={handleChange} required></textarea>
          <button type="submit" className="btn-login">Submit Application</button>
        </form>

        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default Partner;
