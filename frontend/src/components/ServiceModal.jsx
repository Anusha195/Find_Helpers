import React from "react";

const ServiceModal = ({ service, onClose, onSignupOpen }) => {
  const isLoggedIn = localStorage.getItem("userToken");

  const handleBook = () => {
    if (isLoggedIn) {
      alert(`Booking confirmed for ${service.title}!`);
    } else {
      alert("Please login first to book this service.");
      onSignupOpen(); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <p><b>Price:</b> ₹{service.price}</p>
        <p><b>Rating:</b> {service.rating}</p>
        <button className="btn-primary" onClick={handleBook}>Book Now</button>
      </div>
    </div>
  );
};

export default ServiceModal;
