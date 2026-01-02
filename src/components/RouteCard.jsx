import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Bus } from "lucide-react";

export default function RouteCard({ route }) {
  return (
    <Link to={`/route/${route.id}`} style={{ textDecoration: "none" }}>
      <div
        className="route-card"
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }}
      >
        {/* Decorative Top Border */}
        <div
          style={{ height: "6px", background: route.color, width: "100%" }}
        ></div>

        <div style={{ padding: "24px" }}>
          {/* Header with "Logo" Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                background: "#f8fafc",
                color: "#64748b",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Interim Bus Service
            </span>

            {/* Dynamic Route Logo */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: `${route.color}15`, // 15% opacity
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: route.color,
              }}
            >
              <Bus size={24} strokeWidth={2.5} />
            </div>
          </div>

          {/* Route Number & Name */}
          <h2
            style={{
              fontSize: "2rem",
              fontFamily: "Poppins, sans-serif",
              color: route.color,
              lineHeight: 1,
              marginBottom: "8px",
            }}
          >
            {route.route_number}
          </h2>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#1e293b",
              lineHeight: 1.4,
              marginBottom: "16px",
            }}
          >
            {route.name}
          </h3>

          {/* Area Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#64748b",
              fontSize: "0.95rem",
            }}
          >
            <MapPin size={18} />
            <span>
              Servicing <strong>{route.area}</strong>
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fafafa",
          }}
        >
          <span
            style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569" }}
          >
            View Schedule & Map
          </span>
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              color: route.color,
            }}
          >
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}
