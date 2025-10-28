import { useNavigate } from "react-router-dom";
import "../App.css";
import service1 from "../assets/services/sidepic1.png";
import service2 from "../assets/services/sidepic2.png";
import service3 from "../assets/services/sidepic3.png";
import cleanerImg from "../assets/services/cleaner.png";
import acImg from "../assets/services/ac.png";
import makeupImg from "../assets/services/makeup.png";

const Home = ({ onSignupOpen, onPartnerOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <h2>Find Trusted Helpers Near You</h2>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/services")}>
            Book a Service
          </button>
          <button className="btn-secondary" onClick={onPartnerOpen}>
            Become a Partner
          </button>
        </div>
      </section>

      <section className="services-intro">
        <div className="services-wrapper">
          <div className="services-left">
            <h1>Bringing skilled experts to your home</h1>

            <div className="search-box">
              <h3>Select your preferred home service</h3>
              <div className="search-options">
                <div className="option">
                  <img src={cleanerImg} alt="Cleaning" />
                  <p>Cleaning</p>
                </div>
                <div className="option">
                  <img src={acImg} alt="Ac repair" />
                  <p>Ac repair</p>
                </div>
                <div className="option">
                  <img src={makeupImg} alt="MakeUp" />
                  <p>MakeUp</p>
                </div>
              </div>
            </div>

            <div className="service-ratings">
              <div>
                <h2>4.5★</h2>
                <p>Service Rating</p>
              </div>
              <div>
                <h2>1M+</h2>
                <p>Customers Globally</p>
              </div>
            </div>
          </div>

          <div className="services-right">
            <div className="services-gallery">
              <img src={service1} alt="Service in progress" />
              <img src={service2} alt="Professional at work" />
              <img src={service3} alt="Home service example" />
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h3>How It Works</h3>
        <p>
          <b>1.</b> Login/Signup → <b>2.</b> Search → <b>3.</b> Book → <b>4.</b> Get Service
        </p>
      </section>

      <section className="why-choose-us">
        <h3>Why Choose Us</h3>
        <ul>
          <li>✓ Verified Professionals</li>
          <li>✓ Affordable Pricing</li>
          <li>✓ 24x7 Support</li>
          <li>✓ Easy Booking</li>
        </ul>
      </section>
      <section className="cta-section">
        <p>Ready to Book Your First Service?</p>
        <button className="btn-primary" onClick={onSignupOpen}>
          Sign Up Now
        </button>
      </section>
    </div>
  );
};

export default Home;
