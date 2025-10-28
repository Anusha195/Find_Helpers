import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../checkout.css";

const Checkout = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [service, setService] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to load service details. Returning to previous page.",
          timer: 1800,
          showConfirmButton: false,
        });
        navigate(-1);
      }
    };
    fetchService();
  }, [id, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0)
          setSelectedAddress(res.data.addresses[0]);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Unable to load your saved addresses.", "error");
      }
    };
    fetchAddresses();
  }, [token]);

  const handleConfirmBooking = async () => {
    if (!selectedAddress) {
      Swal.fire("Select Address", "Please choose an address to continue.", "info");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          services: [{ serviceId: service.id }], // match backend structure
          addressId: selectedAddress.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        Swal.fire({
          title: "Booking Confirmed 🎉",
          text: "Would you like to view your bookings or continue exploring?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Bookings",
          cancelButtonText: "Continue Browsing",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/profile/bookings");
          } else {
            navigate("/services");
          }
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  if (!service) return <p>Loading service details...</p>;

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-details">
        <h3>Service: {service.title || service.name}</h3>
        <p>Price: ₹{service.price || "On request"}</p>

        <h3>Select Address</h3>
        {addresses.length === 0 ? (
          <p>No addresses found. Please add one in your profile.</p>
        ) : (
          <select
            value={selectedAddress?.id || ""}
            onChange={(e) =>
              setSelectedAddress(
                addresses.find((a) => a.id === parseInt(e.target.value))
              )
            }
          >
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}: {a.line1}, {a.city}, {a.state} - {a.postalCode}
              </option>
            ))}
          </select>
        )}

        <button
          className="btn-primary"
          onClick={handleConfirmBooking}
          disabled={!selectedAddress}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Checkout;
