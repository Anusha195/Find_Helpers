import React, { useEffect, useState } from "react";
import axios from "axios";
import "../address.css";

const ProfileAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });

  const token = localStorage.getItem("token");

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses);
    } catch (err) {
      console.error(err);
      alert("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/addresses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert("Failed to add address");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  return (
    <div className="profile-page">
      <h2>My Addresses</h2>

      <form onSubmit={handleAdd} className="address-form">
        <input
          type="text"
          name="label"
          placeholder="Label (Home/Office)"
          value={form.label}
          onChange={handleChange}
        />
        <input
          type="text"
          name="line1"
          placeholder="Address Line 1"
          value={form.line1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="line2"
          placeholder="Address Line 2"
          value={form.line2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">
          Add Address
        </button>
      </form>

      <h3>Saved Addresses</h3>
      <ul className="address-list">
        {addresses.map((a) => (
          <li key={a.id}>
            <strong>{a.label}</strong>: {a.line1}, {a.line2 && a.line2 + ","}{" "}
            {a.city}, {a.state}, {a.country} - {a.postalCode}
            <button className="btn-secondary" onClick={() => handleDelete(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileAddresses;
