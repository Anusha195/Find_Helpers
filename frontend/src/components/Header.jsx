import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import "../App.css";
import { CartContext } from "../context/CartContext";
import CartModal from "./CartModal";
import axios from "axios";

const Header = ({
  onLoginOpen,
  onSignupOpen,
  onPartnerOpen,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      axios
        .get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCart(res.data))
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [setIsLoggedIn, setCart]);

  const handleLogout = () => {
    Swal.fire({
      title: "Logged Out",
      text: "You’ve been successfully logged out!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setCart([]);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="logo-btn" onClick={() => navigate("/")}>
          <img src={logo} alt="Find Helpers Logo" />
        </button>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/services")}>Services</button>
        <button onClick={() => navigate("/about")}>About Us</button>
        <select className="location-select">
          <option>Select location</option>
          <option>Hyderabad</option>
          <option>Chennai</option>
          <option>Bangalore</option>
        </select>
      </div>

      <div className="nav-right">
        <div className="cart-icon" onClick={() => setShowCart(true)}>
          <FaShoppingCart className="icon" />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>

        <div
          className="profile"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <FaUserCircle className="icon" />
          {isDropdownOpen && (
            <div className="dropdown">
              {!isLoggedIn ? (
                <>
                  <button className="dropdown-btn" onClick={onLoginOpen}>
                    Login
                  </button>
                  <button className="dropdown-btn" onClick={onSignupOpen}>
                    Signup
                  </button>
                  <button className="dropdown-btn" onClick={onPartnerOpen}>
                    Become a Partner
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="dropdown-btn"
                    onClick={() => navigate("/profile/bookings")}
                  >
                    My Bookings
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => navigate("/profile/addresses")}
                  >
                    My Addresses
                  </button>
                  <button className="dropdown-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </nav>
  );
};

export default Header;
