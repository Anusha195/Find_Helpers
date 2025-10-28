import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../mybookings.css";
import HelperBookings from "./HelperBookings";

const MyBookings = ({user}) => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        Swal.fire(
          "Oops!",
          "You must be logged in to view bookings.",
          "warning"
        );
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/bookings/my-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch bookings. Try again.", "error");
      }
    };

    fetchBookings();
  }, [token]);
  const handleCancelBooking = async (bookingId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to cancel booking. Try again.", "error");
    }
  };
  const handleReviewBooking = async (bookingId) => {
    const { value: reviewText } = await Swal.fire({
      title: "Leave a review",
      input: "textarea",
      inputPlaceholder: "Write your review here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
    });

    if (!reviewText) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/review`,
        { review: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        Swal.fire("Thank you!", "Your review has been submitted.", "success");
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, review: reviewText } : b
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit review. Try again.", "error");
    }
  };
  const pendingConfirmed = bookings.filter(
    (b) =>
      b.status.toLowerCase() === "pending" ||
      b.status.toLowerCase() === "confirmed"
  );
  const cancelled = bookings.filter(
    (b) => b.status.toLowerCase() === "cancelled"
  );
  const serviced = bookings.filter(
    (b) => b.status.toLowerCase() === "serviced"
  );

  const renderBookingCard = (b) => (
    <div key={b.id} className="booking-card">
      <h3>{b.service?.title}</h3>
      <p>
        Status: <b>{b.status}</b>
      </p>
      <p>
        Address: {b.address?.label || ""} - {b.address?.line1},{" "}
        {b.address?.city}, {b.address?.state}
      </p>
      <p>Price: ₹{b.service?.price || "On request"}</p>
      {b.status.toLowerCase() === "pending" && (
        <button
          className="btn-cancel"
          onClick={() => handleCancelBooking(b.id)}
        >
          Cancel Booking
        </button>
      )}

      {b.status.toLowerCase() === "serviced" && !b.review && (
        <button
          className="btn-review"
          onClick={() => handleReviewBooking(b.id)}
        >
          Leave a Review
        </button>
      )}

      {b.review && (
        <p>
          <b>Your Review:</b> {b.review}
        </p>
      )}
    </div>
  );

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>
      {pendingConfirmed.length > 0 && (
        <section className="bookings-section">
          <h3>Pending / Confirmed Bookings</h3>
          <div className="bookings-list">
            {pendingConfirmed.map(renderBookingCard)}
          </div>
        </section>
      )}
      {serviced.length > 0 && (
        <section className="bookings-section">
          <h3>Completed / Serviced</h3>
          <div className="bookings-list">{serviced.map(renderBookingCard)}</div>
        </section>
      )}
      {cancelled.length > 0 && (
        <section className="bookings-section">
          <h3>Cancelled Bookings</h3>
          <div className="bookings-list">
            {cancelled.map(renderBookingCard)}
          </div>
        </section>
      )}

      {bookings.length === 0 && <p>No bookings yet.</p>}


      {user?.role === "helper" && (
        <div className="helper-section">
          <h3>Your Service Bookings</h3>
          <HelperBookings />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
