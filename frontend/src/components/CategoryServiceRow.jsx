import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import "../catservice.css";

const CategoryServiceRow = ({
  category,
  isLoggedIn,
  onAddToCart,
  onBookNow,
}) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  const handleBookNowClick = (service) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a service.",
        icon: "info",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then((result) => result.isConfirmed && navigate("/login"));
      return;
    }
    navigate(`/checkout/${service.id}`);
    if (onBookNow) onBookNow(service);
  };

  const handleAddToCartClick = async (service) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add services to cart.",
        icon: "warning",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then((result) => result.isConfirmed && navigate("/login"));
      return;
    }

    try {
      await addToCart(service);
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${service.title} has been added to your cart.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Unable to add item to cart.", "error");
    }
  };

  return (
    <div className="category-row">
      <h2>
        {category.name} ({category.services.length})
      </h2>
      <div className="services-row">
        {category.services.slice(0, visibleCount).map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>₹{service.price || "On request"}</p>
            {Array.isArray(service.cities) && service.cities.length > 0 && (
              <p>
                <b>Available in:</b> {service.cities.join(", ")}
              </p>
            )}
            <div className="service-actions">
              <button className="btn-primary" onClick={() => handleBookNowClick(service)}>
                Book Now
              </button>
              <button className="btn-secondary" onClick={() => handleAddToCartClick(service)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < category.services.length && (
        <button className="load-more" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default CategoryServiceRow;
