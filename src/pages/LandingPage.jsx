import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Bus, Map, Clock } from "lucide-react";
import "./LandingPage.css"; // Import the CSS file

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="container landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="ping-wrapper">
              <span className="ping-animation"></span>
              <span className="ping-dot"></span>
            </span>
            Service Guide & Simulation
          </div>

          <h1 className="hero-title">
            Davao City <span className="highlight-text">Bus Routes</span>
          </h1>

          <p className="hero-subtitle">
            Navigate the city with ease. View official interim bus schedules,
            find stops near you, and simulate your daily commute.
          </p>

          <div className="hero-buttons">
            <Link to="/routes" className="btn">
              View All Routes
            </Link>
            <a href="#features" className="btn-outline">
              How it Works
            </a>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div id="features" className="container features-container">
        <div className="features-grid">
          {/* Card 1 */}
          <div className="card-panel feature-card">
            {/* Added 'feature-icon' class for hover animation */}
            <div className="feature-icon">
              <Bus size={28} />
            </div>
            <h3>Official Routes</h3>
            <p>
              Access detailed path data for all interim bus routes (R102, R103,
              R402) directly from official sources.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-panel feature-card">
            <div className="feature-icon">
              <Clock size={28} />
            </div>
            <h3>Accurate Schedules</h3>
            <p>
              Check AM and PM departure times to plan your trip ahead and avoid
              long waiting times.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-panel feature-card">
            <div className="feature-icon">
              <Map size={28} />
            </div>
            <h3>Trip Simulation</h3>
            <p>
              Visualize the bus journey on an interactive map. Watch the bus
              move from stop to stop in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="landing-footer">
        <p>
          Made by <strong>John Michael F. Rivera</strong>.
        </p>
        <span className="attribution-link">
          Bus Data Source:{" "}
          <a
            href="https://github.com/ttg-eng/routes"
            target="_blank"
            rel="noopener noreferrer"
          >
            TTG Engineering (MIT License)
          </a>
        </span>
      </footer>
    </>
  );
}
