import "../App.css";
import { useNavigate } from "react-router-dom";
const About = () => {
  const Navigate = useNavigate();
  return (
    <div className="about-container">
      <section className="about-intro">
        <h2>About Find Helpers</h2>
        <p>
          Find Helpers is a trusted platform that connects users with skilled
          professionals for all types of home and personal services. From plumbing
          and electrical repairs to cleaning and beauty services, we make it simple
          to find verified experts near you — anytime, anywhere.
        </p>
      </section>

      <section className="mission-vision">
        <h3>Our Mission</h3>
        <p>
          To empower local workers by giving them digital visibility and help users
          find reliable, affordable, and timely services at their doorstep.
        </p>

        <h3>Our Vision</h3>
        <p>
          To build India’s most trusted service marketplace that supports both
          communities and customers with transparency and care.
        </p>
      </section>

      <section className="about-why">
        <h3>Why Choose Us</h3>
        <ul>
          <li>✓ Verified and Trained Professionals</li>
          <li>✓ Affordable and Transparent Pricing</li>
          <li>✓ 24/7 Customer Support</li>
          <li>✓ Quick and Hassle-Free Bookings</li>
        </ul>
      </section>

      <section className="about-team">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          <div className="team-card">
            <h4>Anusha</h4>
            <p>Frontend Developer</p>
          </div>
          <div className="team-card">
            <h4>Srinivas</h4>
            <p>Backend Developer</p>
          </div>
          <div className="team-card">
            <h4>Umadevi</h4>
            <p>Database Engineer</p>
          </div>
        </div>
      </section>

      <section className="about-impact">
        <h3>Our Impact</h3>
        <div className="impact-stats">
          <div>
            <h4>500+</h4>
            <p>Verified Helpers</p>
          </div>
          <div>
            <h4>1200+</h4>
            <p>Successful Jobs</p>
          </div>
          <div>
            <h4>98%</h4>
            <p>Customer Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <p>Join us and experience the comfort of trusted home services.</p>
        <button className="btn-primary" onClick={()=>Navigate('/services')}>Explore Services</button>
      </section>
    </div>
  );
};

export default About;
