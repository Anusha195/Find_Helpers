import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import "../admin.css";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", categoryId: "" });
  const [editId, setEditId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [assignedCityIds, setAssignedCityIds] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await Promise.all([loadServices(), loadCategories(), loadCities()]);
  }
  async function loadServices() {
    try {
      const res = await axios.get("/admin/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load services");
    }
  }
  async function loadCategories() {
    try {
      const res = await axios.get("/admin/categories");
      const data = res.data.categories || res.data; 
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  }

  async function loadCities() {
    try {
      const res = await axios.get("/admin/cities");
      setCities(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) await axios.put(`/admin/services/${editId}`, form);
      else await axios.post("/admin/services", form);
      setForm({ title: "", price: "", categoryId: "" });
      setEditId(null);
      loadServices();
    } catch (err) {
      console.error(err);
      alert("Failed to save service");
    }
  }

  function startEdit(s) {
    setEditId(s.id);
    setForm({
      title: s.title,
      price: s.price || "",
      categoryId: s.categoryId || "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete service?")) return;
    try {
      await axios.delete(`/admin/services/${id}`);
      loadServices();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  }

  // City assignment
  async function openAssign(service) {
    setSelectedService(service);
    try {
      const res = await axios.get(`/admin/services/${service.id}/cities`);
      const assigned = res.data
        .map((r) => r.cityId || r.city?.id)
        .filter(Boolean);
      setAssignedCityIds(assigned);
    } catch (err) {
      console.error(err);
      alert("Failed to load assignments");
    }
  }

  function toggleCity(id) {
    setAssignedCityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function saveAssignments() {
    if (!selectedService) return;
    try {
      await axios.post(`/admin/services/${selectedService.id}/cities`, {
        cityIds: assignedCityIds,
      });
      alert("Assignments saved");
      setSelectedService(null);
      setAssignedCityIds([]);
    } catch (err) {
      console.error(err);
      alert("Failed to save assignments");
    }
  }

  return (
    <div className="admin-content" style={{ display: "flex", gap: 50 }}>
      <div style={{ flex: 1 }}>
        <h2>Services</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ title: "", price: "", categoryId: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.title}</td>
                <td>{s.price}</td>
                <td>{s.Category?.name || s.categoryId}</td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => startEdit(s)}>Edit</button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{ marginLeft: 6 }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openAssign(s)}
                      style={{ marginLeft: 6 }}
                    >
                      Assign Cities
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: 360 }}>
        {selectedService ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <strong>Service: </strong>
              {selectedService.title}
            </div>
            <div  className="city-list" style={{ maxHeight: 400, overflowY: "auto" }}>
              {cities.map((city) => {
                const checked = assignedCityIds.includes(city.id);
                return (
                  <div
                    key={city.id}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCity(city.id)}
                    />
                    <span>{city.name}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10 }}>
              <button onClick={saveAssignments}>Save</button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  setAssignedCityIds([]);
                }}
                style={{ marginLeft: 8 }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
