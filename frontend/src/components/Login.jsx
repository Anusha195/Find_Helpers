import React, { useState } from "react";
import Swal from "sweetalert2";
import "../login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ show, onClose, onSignupClick, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        Swal.fire("Login Failed", data.message || "Invalid credentials", "error");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);

      Swal.fire({
        title: "Welcome back!",
        text: `Hello ${data.user.name || "User"} 👋`,
        icon: "success",
        confirmButtonText: "Continue",
        timer: 1500,
      });

      onClose();
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error. Please try again later.", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSignupClick();
            }}
          >
            Register
          </a>
        </p>

        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Login;
