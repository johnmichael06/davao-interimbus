import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Bus, Map, Clock, ChevronRight, Info } from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="landing-wrapper">
        <div className="container landing-hero">
          <div className="hero-content">
            {/* Status Pill */}

            <h1 className="hero-title">
              Davao Commutes <br />
              <span className="highlight-text">Made Simple.</span>
            </h1>

            <p className="hero-subtitle">
              Don't guess where the bus stops. View official Interim Bus System
              (IBS) routes, check dispatch schedules, and visualize your trip on
              our interactive map.
            </p>

            <div className="hero-buttons">
              <Link to="/routes" className="btn btn-primary">
                Find My Bus
                <ChevronRight size={20} strokeWidth={2.5} />
              </Link>
              <a href="#how-it-works" className="btn btn-text">
                How it works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="hero-stats">
              <div className="stat-item">
                <strong>100%</strong> Free
              </div>
              <div className="stat-separator"></div>
              <div className="stat-item">
                <strong>No</strong> App Download
              </div>
              <div className="stat-separator"></div>
              <div className="stat-item">
                <strong>Student</strong> Project
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIVE ROUTES TICKER (Overlapping Card) --- */}
      <section className="section-routes">
        <div className="container">
          <div className="routes-card-wrapper">
            <span className="routes-label">Supported Routes</span>
            <div className="routes-grid">
              <div className="route-badge">
                <span className="route-id">R102</span>
                <span className="route-name">Toril - Torres</span>
              </div>

              <div className="route-badge">
                <span className="route-id">R103</span>
                <span className="route-name">Toril - Roxas</span>
              </div>

              <div className="route-badge">
                <span className="route-id">R402</span>
                <span className="route-name">Bunawan via Buhangin</span>
              </div>

              <div className="route-badge pending">
                <span className="route-id">...</span>
                <span className="route-name">More coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES "BENTO" GRID --- */}
      <section id="how-it-works" className="section-features">
        <div className="container">
          <div className="section-title">
            <h2>Everything you need to ride.</h2>
          </div>

          <div className="features-bento">
            {/* Main Feature - Large Box */}
            <div className="bento-box large-box">
              <div className="bento-icon-bg">
                <Map size={32} strokeWidth={2} />
              </div>
              <h3>Interactive Trip Simulation</h3>
              <p>
                Not sure where the bus turns? Watch a real-time simulation of
                the bus moving along the map to understand the exact path before
                you even leave your house.
              </p>
            </div>

            {/* Sub Feature 1 */}
            <div className="bento-box">
              <div className="feature-icon-small">
                <Clock size={28} strokeWidth={2} />
              </div>
              <h3>Dispatch Schedules</h3>
              <p>
                Check AM/PM departure times so you don't wait at the stop for
                hours.
              </p>
            </div>

            {/* Sub Feature 2 */}
            <div className="bento-box">
              <div className="feature-icon-small">
                <Bus size={28} strokeWidth={2} />
              </div>
              <h3>Official Stops</h3>
              <p>
                Data sourced directly from CTTMO and City Government official
                releases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT THE DEVELOPER --- */}
      <section className="section-about">
        <div className="container">
          <div className="about-card">
            <div className="about-content">
              <div className="about-tag">
                <Info size={14} /> About the Project
              </div>
              <h2>Built for Davaoeños</h2>
              <p>
                Hi! I'm <strong>John Michael Rivera</strong>, an IT student at
                Ateneo de Davao University. I built this website to help fellow
                students and workers navigate the new bus system. It's a
                personal initiative to support our city's modernization efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            {/* Left Side: Brand & Tagline */}
            <div className="footer-brand">
              <div className="brand-logo">
                <span className="brand-dot"></span> DavaoBus
              </div>
              <p>Helping Davaoeños navigate the city safely.</p>
            </div>

            {/* Right Side: Credits & Data */}
            <div className="footer-links">
              <div className="credit-badge">
                Made by <strong>John Michael Rivera</strong>
              </div>
              <a
                href="https://github.com/ttg-eng/routes"
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                Data Source: TTG Engineering (MIT)
              </a>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p className="disclaimer-text">
              <strong>Disclaimer:</strong> This is an unofficial, student-led
              project and is not affiliated with the Davao City Government.
              Route data is based on public records and may be subject to
              change.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
