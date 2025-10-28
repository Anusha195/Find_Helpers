import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Partner from "./components/Partner";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import CategoryServices from "./pages/CategoryServices";
import ProfileAddresses from "./pages/ProfileAddress";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPartnerRequests from "./pages/admin/AdminPartnerRequests";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminServices from "./pages/admin/AdminServices";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Header
                  onLoginOpen={() => setShowLoginModal(true)}
                  onSignupOpen={() => setShowSignupModal(true)}
                  onPartnerOpen={() => setShowPartnerModal(true)}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />

                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        onSignupOpen={() => setShowSignupModal(true)}
                        onPartnerOpen={() => setShowPartnerModal(true)}
                      />
                    }
                  />
                  <Route
                    path="/services"
                    element={<Services isLoggedIn={isLoggedIn} />}
                  />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/category/:slug"
                    element={<CategoryServices isLoggedIn={isLoggedIn} />}
                  />

                  <Route
                    path="/profile/addresses"
                    element={
                      isLoggedIn ? (
                        <ProfileAddresses />
                      ) : (
                        <Navigate to="/" replace />
                      )
                    }
                  />
                  <Route
                    path="/profile/bookings"
                    element={
                      isLoggedIn ? <MyBookings user={JSON.parse(localStorage.getItem("user"))}/> : <Navigate to="/" replace />
                    }
                  />
                  <Route
                    path="/checkout/:id"
                    element={
                      isLoggedIn ? <Checkout /> : <Navigate to="/" replace />
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <h2 style={{ textAlign: "center" }}>
                        404 - Page Not Found
                      </h2>
                    }
                  />
                </Routes>

                <Footer />

                <Login
                  show={showLoginModal}
                  onClose={() => setShowLoginModal(false)}
                  onSignupClick={() => {
                    setShowLoginModal(false);
                    setShowSignupModal(true);
                  }}
                  setIsLoggedIn={setIsLoggedIn}
                />

                <Signup
                  show={showSignupModal}
                  onClose={() => setShowSignupModal(false)}
                  setIsLoggedIn={setIsLoggedIn}
                />

                <Partner
                  show={showPartnerModal}
                  onClose={() => setShowPartnerModal(false)}
                />
              </>
            }
          />

          <Route
            path="/admin/*"
            element={isAdmin ? <AdminLayout /> : <Navigate to="/" replace />}
          >
            <Route index element={<AdminDashboard />} /> {/* default /admin */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="partner-requests" element={<AdminPartnerRequests />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="services" element={<AdminServices />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
