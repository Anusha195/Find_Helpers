import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import Swal from "sweetalert2";
import '../admin.css';
export default function AdminPartnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/admin/partner-requests");
      const data = Array.isArray(res.data) ? res.data : res.data?.requests || [];
      setRequests(data);
    } catch (err) {
      console.error("Error loading requests:", err);
      Swal.fire("Error", "Failed to load partner requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/admin/partner-requests/${id}/approve`);
      Swal.fire("Approved", "Partner request approved successfully", "success");
      fetchRequests();
    } catch (err) {
      Swal.fire("Error", "Failed to approve request", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/admin/partner-requests/${id}/reject`);
      Swal.fire("Rejected", "Partner request rejected", "info");
      fetchRequests();
    } catch (err) {
      Swal.fire("Error", "Failed to reject request", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!requests.length)
    return <p style={{ textAlign: "center" }}>No partner requests found.</p>;

  return (
    <div className="admin-page">
      <h2>Partner Requests</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Category</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.fullName}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.category?.name || "-"}</td>
              <td>{r.city || "-"}</td>
              <td>
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(r.id)}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReject(r.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
