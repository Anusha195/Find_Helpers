import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import "../catservice.css";
const CategoryServices = ({ isLoggedIn }) => {
  const { slug } = useParams();
  const [services, setServices] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/category/${slug}`
        );
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services", err);
        Swal.fire("Error", "Unable to load services at the moment.", "error");
      }
    };
    fetchServices();
  }, [slug]);

  const handleBookNow = (service) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a service.",
        icon: "info",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    navigate(`/checkout/${service.id}`);
  };

  const handleAddToCart = async (service) => {
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
    <div className="category-services">
      <h2>Available Services in {slug.replace("-", " ").toUpperCase()}</h2>

      {services.length === 0 ? (
        <div className="no-services">
          <p>
            There are currently no services available in this category.
            <br />
            We’ll be adding more soon — please check back later!
          </p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              {s.cities?.length > 0 && (
                <p>
                  <b>Available in:</b> {s.cities.join(", ")}
                </p>
              )}
              <p>
                <b>Price:</b> ₹{s.price || "On request"}
              </p>

              <div className="button-group">
                <button
                  className="btn-primary"
                  onClick={() => handleBookNow(s)}
                >
                  Book Now
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleAddToCart(s)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryServices;
