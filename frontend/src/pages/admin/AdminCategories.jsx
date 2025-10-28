import React, { useEffect, useState } from 'react';
import axios from "../../api/axiosInstance";
import '../admin.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get('/admin/categories');
      setCategories(res.data);
    } catch (err) { console.error(err); alert('Failed to load categories'); }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) await axios.put(`/admin/categories/${editId}`, { name });
      else await axios.post('/admin/categories', { name });
      setName(''); setEditId(null);
      load();
    } catch (err) { console.error(err); alert('Failed to save'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete category?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`);
      load();
    } catch (err) { console.error(err); alert('Failed to delete'); }
  }

  function startEdit(cat) {
    setEditId(cat.id); setName(cat.name);
  }

  return (
    <div className="admin-content">
      <h2>Categories</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }}>Cancel</button>}
      </form>

      {loading ? <div>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>ID</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>
                  <button onClick={() => startEdit(c)}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
