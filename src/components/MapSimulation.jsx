import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = new L.DivIcon({
  className: "custom-bus-icon",
  html: `<div style="background-color: white; border: 3px solid #0FA4A9; border-radius: 50%; padding: 2px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); font-size: 28px; display: flex; justify-content: center; align-items: center; width: 48px; height: 48px;">🚌</div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// 1. HELPER: Recenter map when focusedPoint changes
function RecenterMap({ focusedPoint }) {
  const map = useMap();
  useEffect(() => {
    if (focusedPoint) {
      // Fly to the point with a smooth animation and Zoom level 16
      map.flyTo([focusedPoint.lat, focusedPoint.lng], 16, {
        duration: 1.5, // Animation duration in seconds
      });
    }
  }, [focusedPoint, map]);
  return null;
}

// 2. HELPER: Fit bounds on initial load
function InitialBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = points.map((p) => [p.lat, p.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function MapSimulation({ points, color, focusedPoint }) {
  const [busPosition, setBusPosition] = useState(points[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Simulation Logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, points.length]);

  useEffect(() => {
    setBusPosition(points[currentIndex]);
  }, [currentIndex, points]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setBusPosition(points[0]);
  };

  const polylinePositions = points.map((p) => [p.lat, p.lng]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Controls */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 999,
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          display: "flex",
          gap: "10px",
        }}
      >
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="btn"
            style={{ padding: "10px 20px", fontSize: "0.9rem" }}
          >
            {currentIndex === 0 ? "Start Simulation" : "Resume"}
          </button>
        ) : (
          <button
            onClick={() => setIsPlaying(false)}
            className="btn"
            style={{
              background: "#e11d48",
              padding: "10px 20px",
              fontSize: "0.9rem",
            }}
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="btn-outline"
          style={{
            padding: "10px 20px",
            fontSize: "0.9rem",
            borderRadius: "50px",
          }}
        >
          Reset
        </button>
      </div>

      <MapContainer
        center={[7.0707, 125.6087]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Helper components to control the map view */}
        <InitialBounds points={points} />
        <RecenterMap focusedPoint={focusedPoint} />

        <Polyline
          positions={polylinePositions}
          pathOptions={{ color: color, weight: 8, opacity: 0.6 }}
        />

        {points.map((point, idx) => {
          if (point.kind !== "stop") return null;
          const isVisited = idx <= currentIndex;
          // Highlight the currently focused stop with a different color/size?
          const isFocused =
            focusedPoint &&
            focusedPoint.lat === point.lat &&
            focusedPoint.lng === point.lng;

          return (
            <CircleMarker
              key={idx}
              center={[point.lat, point.lng]}
              radius={isFocused ? 18 : 14} // Make it bigger if clicked
              pathOptions={{
                color: isVisited ? "#334155" : isFocused ? "#ef4444" : "white", // Red border if focused
                fillColor: isVisited ? "#334155" : color,
                fillOpacity: 1,
                weight: isVisited ? 3 : isFocused ? 5 : 4,
                opacity: 1,
              }}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ fontSize: "1.1rem" }}>{point.name}</strong>
                  <br />
                  <span style={{ color: isVisited ? "#334155" : color }}>
                    {isVisited ? "✓ Bus has departed" : "Bus arriving soon"}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <Marker
          position={[busPosition.lat, busPosition.lng]}
          icon={busIcon}
          zIndexOffset={1000}
        >
          <Popup>Current Bus Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
