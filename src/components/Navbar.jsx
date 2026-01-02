import { Link } from "react-router-dom";
import { Bus } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "white",
        boxShadow: "var(--shadow)",
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--primary)",
          }}
        >
          <Bus size={32} />
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              fontFamily: "Poppins",
            }}
          >
            Davao Bus
          </span>
        </Link>
        <Link
          to="/routes"
          className="btn-outline"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          All Routes
        </Link>
      </div>
    </nav>
  );
}
