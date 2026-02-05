import { FC } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: FC = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">YOUR LOGO</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>

          <Link className="login-btn" to="/login">
            Login
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">Welcome to MultiTenant Management System</h1>

        <p className="hero-text">
          A powerful system to manage multiple companies, products, staff, and operations
          in one unified platform.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="primary-btn">Start Now</Link>
          <a href="#about" className="outline-btn">Learn More</a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
