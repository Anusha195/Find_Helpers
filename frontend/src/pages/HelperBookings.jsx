import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const HelperBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/helpers/${user.id}/bookings/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load bookings");

      setBookings(Array.isArray(data) ? data : data.pendingBookings || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Unable to fetch bookings", "error");
    }
  };

  useEffect(() => {
    if (user?.role === "helper") fetchBookings();
  }, [user]);

  const handleConfirm = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ helperId: user.id }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to confirm booking");

      Swal.fire("Success", "Booking confirmed successfully", "success");
      fetchBookings();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Unable to confirm booking", "error");
    }
  };

  if (!bookings.length)
    return <p>No pending bookings available in your category.</p>;

  return (
    <div className="helper-bookings p-4">
      <h2 className="text-xl font-semibold mb-3">
        Pending Bookings in Your Category
      </h2>
      {bookings.map((b) => (
        <div
          key={b.id}
          className="booking-card border rounded p-3 mb-3 shadow-sm"
        >
          <p>
            <strong>Service:</strong> {b.service?.title}
          </p>
          <p>
            <strong>Category ID:</strong> {b.service?.categoryId}
          </p>
          <p>
            <strong>User:</strong> {b.user?.name} ({b.user?.email})
          </p>
          <p>
            <strong>Status:</strong> {b.status}
          </p>

          <button
            onClick={() => handleConfirm(b.id)}
            className="confirm-btn"
          >
            Confirm Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default HelperBookings;
