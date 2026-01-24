import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapSimulation from "../components/MapSimulation";
import { routesData } from "../data/routes";
import { ArrowLeft, Clock, MapPin, MousePointerClick } from "lucide-react";
import "./RouteDetailPage.css";

export default function RouteDetailPage() {
  const { id } = useParams();
  const route = routesData.find((r) => r.id === id || r.route_number === id);
  const [focusedStop, setFocusedStop] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (!route) {
    return (
      <div className="container" style={{ padding: "50px" }}>
        Route not found.
      </div>
    );
  }

  const stopsOnly = route.points.filter((p) => p.kind === "stop");

  return (
    <>
      <Navbar />

      <div
        className="container route-detail-container"
        style={{
          "--route-color": route.color,
          "--route-color-faint": `${route.color}50`,
        }}
      >
        <Link to="/routes" className="back-link">
          <ArrowLeft size={20} /> Back to Routes
        </Link>

        {/* --- header --- */}
        <div className="route-header" style={{ backgroundColor: route.color }}>
          <div className="header-top-row">
            <span className="route-badge">ROUTE {route.route_number}</span>
          </div>

          <h1 className="route-title">{route.name}</h1>
          <p className="route-subtitle">
            Servicing the <strong>{route.area}</strong> area
          </p>
        </div>

        <div className="route-detail-grid">
          {/* left column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* sched card */}
            <div className="card-panel" style={{ padding: "24px" }}>
              <h3 className="card-title">
                <Clock size={24} /> Schedules
              </h3>

              {/* am trips */}
              <div className="schedule-group">
                <h5 className="schedule-label">AM Departures</h5>
                <div className="schedule-time-list">
                  {route.schedule.am.length > 0 ? (
                    route.schedule.am.map((time, i) => (
                      <span key={i} className="time-chip">
                        {time}
                      </span>
                    ))
                  ) : (
                    <span className="no-trips">No AM trips</span>
                  )}
                </div>
              </div>

              {/* pm trips */}
              <div>
                <h5 className="schedule-label">PM Departures</h5>
                <div className="schedule-time-list">
                  {route.schedule.pm.length > 0 ? (
                    route.schedule.pm.map((time, i) => (
                      <span key={i} className="time-chip">
                        {time}
                      </span>
                    ))
                  ) : (
                    <span className="no-trips">No PM trips</span>
                  )}
                </div>
              </div>
            </div>

            {/* bus stop card */}
            <div className="card-panel" style={{ padding: "24px" }}>
              <div className="card-header-row">
                <h3 className="card-title" style={{ marginBottom: 0 }}>
                  <MapPin size={24} /> Bus Stops
                </h3>
                <span className="click-hint">
                  <MousePointerClick size={14} /> Click to locate
                </span>
              </div>

              <div className="stops-scroll-container custom-scrollbar">
                <ul className="timeline-list">
                  <div className="timeline-line"></div>
                  {stopsOnly.map((point, idx) => {
                    const isActive = focusedStop?.lat === point.lat;
                    return (
                      <li
                        key={idx}
                        className={`timeline-item ${isActive ? "active" : ""}`}
                        onClick={() =>
                          setFocusedStop({ lat: point.lat, lng: point.lng })
                        }
                      >
                        <div className="timeline-dot"></div>
                        <span className="stop-name">{point.name}</span>
                        <span className="stop-number">STOP {idx + 1}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* the map */}
          <div className="map-sticky-container">
            <MapSimulation
              points={route.points}
              color={route.color}
              focusedPoint={focusedStop}
            />
          </div>
        </div>
      </div>
    </>
  );
}
