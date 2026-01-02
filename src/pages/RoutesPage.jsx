import { useState } from "react";
import Navbar from "../components/Navbar";
import RouteCard from "../components/RouteCard";
import { routesData } from "../data/routes";
import { Search } from "lucide-react";

export default function RoutesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter Logic: Checks Route Number, Name, or Area
  const filteredRoutes = routesData.filter((route) => {
    const term = searchTerm.toLowerCase();
    return (
      route.route_number.toLowerCase().includes(term) ||
      route.name.toLowerCase().includes(term) ||
      route.area.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ padding: "40px 20px", minHeight: "80vh" }}
      >
        {/* page title and search */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 50px auto",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            Find Your Route
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-muted)",
              marginBottom: "30px",
            }}
          >
            Search by route number (e.g., R102), destination, or area.
          </p>

          {/* search-bar container */}
          <div
            style={{
              position: "relative",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--primary)",
                pointerEvents: "none",
              }}
            >
              <Search size={22} />
            </div>

            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px 16px 55px", // Left padding for icon
                fontSize: "1rem",
                borderRadius: "50px",
                border: "2px solid rgba(15, 164, 169, 0.2)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                outline: "none",
                color: "var(--text-main)",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
                e.target.style.boxShadow = "0 0 0 4px rgba(15, 164, 169, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(15, 164, 169, 0.2)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
              }}
            />
          </div>
        </div>

        {/* the result grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>

        {/* if empty state (oo results) */}
        {filteredRoutes.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ marginBottom: "15px", opacity: 0.5 }}>
              <Search size={48} />
            </div>
            <h3 style={{ marginBottom: "8px" }}>No routes found</h3>
            <p>We couldn't find any routes matching "{searchTerm}".</p>
            <button
              onClick={() => setSearchTerm("")}
              className="btn-outline"
              style={{ marginTop: "20px" }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
  );
}
