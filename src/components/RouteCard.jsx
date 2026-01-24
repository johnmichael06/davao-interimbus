import { useState, useEffect } from "react";
import {
  MapPin,
  ArrowRight,
  Users,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  HelpCircle, // Added icon for the help toggle
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./RouteCard.css";

export default function RouteCard({ route }) {
  // --- STATE ---
  const [votes, setVotes] = useState({ low: 0, med: 0, high: 0 });
  const [userVoted, setUserVoted] = useState(null);
  const [isGlobalCooldown, setIsGlobalCooldown] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New State for toggling the help info
  const [showHelp, setShowHelp] = useState(false);

  // --- MODAL STATE (Unified for Confirm, Error, & Success) ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "CONFIRM",
    title: "",
    message: "",
  });

  // --- BRAND COLORS ---
  const brandPrimary = "#0fa4a9";
  const brandLight = "#e0f2f1";

  // --- 1. GENERATE DEVICE FINGERPRINT ---
  const getDeviceFingerprint = () => {
    const rawId =
      navigator.userAgent + navigator.language + screen.width + screen.height;
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      const char = rawId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return "device_" + Math.abs(hash);
  };

  const deviceId = getDeviceFingerprint();

  // --- 2. FETCH DATA & CHECK GLOBAL COOLDOWN ---
  useEffect(() => {
    fetchLiveVotes();

    const globalLastVote = localStorage.getItem("davao_bus_global_timestamp");
    if (
      globalLastVote &&
      Date.now() - parseInt(globalLastVote) < 15 * 60 * 1000
    ) {
      setIsGlobalCooldown(true);
      const votedRoute = localStorage.getItem("davao_bus_voted_route");
      if (votedRoute === route.route_number) {
        const choice = localStorage.getItem("davao_bus_last_choice");
        setUserVoted(choice);
      }
    } else {
      setIsGlobalCooldown(false);
      setUserVoted(null);
    }

    const interval = setInterval(fetchLiveVotes, 30000);
    return () => clearInterval(interval);
  }, [route.route_number]);

  const fetchLiveVotes = async () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("bus_votes")
      .select("vote_type")
      .eq("route_id", route.route_number)
      .gt("created_at", thirtyMinsAgo);

    if (data) {
      const newVotes = { low: 0, med: 0, high: 0 };
      data.forEach((vote) => {
        if (newVotes[vote.vote_type] !== undefined) newVotes[vote.vote_type]++;
      });
      setVotes(newVotes);
    }
  };

  // --- 3. MODAL HELPERS ---
  const showInfoModal = (mode, title, message) => {
    setModalConfig({ isOpen: true, mode, title, message });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // --- 4. HANDLE VOTING ---
  const initiateVote = (type) => {
    if (isGlobalCooldown) {
      showInfoModal(
        "ALERT",
        "Please Wait",
        "Anti-Spam: You can only cast ONE vote (for any bus) every 15 minutes.",
      );
      return;
    }
    setPendingVote(type);
    setModalConfig({
      isOpen: true,
      mode: "CONFIRM",
      title: "Confirm Report?",
      message: "",
    });
  };

  const confirmVote = async () => {
    setIsSubmitting(true);
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { count, error: checkError } = await supabase
      .from("bus_votes")
      .select("*", { count: "exact", head: true })
      .eq("guest_id", deviceId)
      .gt("created_at", fifteenMinsAgo);

    if (checkError) {
      showInfoModal("ALERT", "Error", "Connection error. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (count > 0) {
      showInfoModal(
        "ALERT",
        "Please Wait",
        "Anti-Spam: You already voted on a bus recently. Please wait 15 minutes.",
      );
      localStorage.setItem("davao_bus_global_timestamp", Date.now());
      setIsGlobalCooldown(true);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("bus_votes").insert([
      {
        route_id: route.route_number,
        vote_type: pendingVote,
        guest_id: deviceId,
      },
    ]);

    if (!error) {
      setVotes((prev) => ({ ...prev, [pendingVote]: prev[pendingVote] + 1 }));
      setUserVoted(pendingVote);
      setIsGlobalCooldown(true);

      localStorage.setItem("davao_bus_global_timestamp", Date.now());
      localStorage.setItem("davao_bus_voted_route", route.route_number);
      localStorage.setItem("davao_bus_last_choice", pendingVote);

      showInfoModal(
        "SUCCESS",
        "Success!",
        "Thank you! Your report helps other commuters.",
      );
    } else {
      showInfoModal("ALERT", "Error", "Failed to submit report.");
    }
    setIsSubmitting(false);
  };

  // --- 5. RENDER HELPERS ---
  const getMajorityText = () => {
    const total = votes.low + votes.med + votes.high;
    if (total === 0) return "No reports yet. Be the first!";

    let maxType = "low";
    let maxCount = votes.low;
    if (votes.med > maxCount) {
      maxType = "med";
      maxCount = votes.med;
    }
    if (votes.high > maxCount) {
      maxType = "high";
      maxCount = votes.high;
    }

    const labels = { low: "Empty / Easy", med: "Standing Room", high: "Full" };
    return (
      <span>
        This bus is <strong>{labels[maxType]}</strong> according to{" "}
        <strong>{maxCount}</strong> people.
      </span>
    );
  };

  const getBtnStyle = (type) => {
    const isSelected = userVoted === type;
    return {
      borderColor: isSelected ? brandPrimary : "#cbd5e1",
      background: isSelected ? brandLight : "white",
      color: isSelected ? brandPrimary : "#64748b",
      boxShadow: isSelected
        ? `0 4px 10px -2px rgba(15, 164, 169, 0.2)`
        : "none",
      opacity: isGlobalCooldown && !isSelected ? 0.5 : 1,
      cursor: isGlobalCooldown ? "not-allowed" : "pointer",
    };
  };

  const getIconColor = (type) => {
    if (userVoted === type) return brandPrimary;
    if (isGlobalCooldown) return "#cbd5e1";
    if (type === "low") return "#22c55e";
    if (type === "med") return "#eab308";
    if (type === "high") return "#ef4444";
  };

  return (
    <>
      <div className="route-card">
        {/* HEADER */}
        <div>
          <span className="route-number-badge">{route.route_number}</span>
          <h3 className="route-name">{route.name}</h3>
          <div className="route-area">
            <MapPin size={14} /> {route.area} Area
          </div>
        </div>

        {/* STATUS SECTION */}
        <div className="status-container">
          <div className="status-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Live Reports (30m)</span>
              {/* NEW HELP ICON TRIGGER */}
              <HelpCircle
                size={14}
                className="help-icon"
                onClick={() => setShowHelp(!showHelp)}
                style={{ cursor: "pointer", color: brandPrimary }}
              />
            </div>
            <span className="total-badge">
              {votes.low + votes.med + votes.high} total
            </span>
          </div>

          {/* NEW COLLAPSIBLE HELP SECTION */}
          {showHelp && (
            <div
              className="help-section"
              style={{
                background: "#e0f2f1",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "16px",
                fontSize: "0.85rem",
                color: "#0f766e",
                border: "1px solid #99f6e4",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                How it works:
              </div>
              <ul
                style={{ margin: "0", paddingLeft: "20px", lineHeight: "1.4" }}
              >
                <li>
                  <strong>30-Minute Refresh:</strong> Reports only show data
                  from the last 30 minutes to ensure accuracy.
                </li>
                <li>
                  <strong>One Vote Rule:</strong> To prevent spam, you can only
                  vote for <strong>1 bus every 15 minutes</strong>.
                </li>
                <li>
                  <strong>Community Driven:</strong> Data comes from real
                  commuters like you!
                </li>
              </ul>
            </div>
          )}

          <div className="vote-buttons-row">
            <button
              onClick={() => initiateVote("low")}
              disabled={isGlobalCooldown}
              className="vote-btn"
              style={getBtnStyle("low")}
            >
              <Users size={20} color={getIconColor("low")} /> Easy ({votes.low})
            </button>
            <button
              onClick={() => initiateVote("med")}
              disabled={isGlobalCooldown}
              className="vote-btn"
              style={getBtnStyle("med")}
            >
              <Users size={20} color={getIconColor("med")} /> Standing (
              {votes.med})
            </button>
            <button
              onClick={() => initiateVote("high")}
              disabled={isGlobalCooldown}
              className="vote-btn"
              style={getBtnStyle("high")}
            >
              <AlertCircle size={20} color={getIconColor("high")} /> Full (
              {votes.high})
            </button>
          </div>

          <div className="majority-text">{getMajorityText()}</div>
        </div>

        {/* VIEW MAP BUTTON */}
        <Link to={`/route/${route.id}`} className="view-map-link">
          <button className="view-map-btn">
            View Map & Stops <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      {/* --- UNIFIED MODAL --- */}
      {modalConfig.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-icon" onClick={closeModal}>
              <X size={20} />
            </button>

            {/* MODAL HEADER */}
            <div
              className={`modal-icon-wrapper ${modalConfig.mode.toLowerCase()}`}
            >
              {modalConfig.mode === "CONFIRM" && <Info size={32} />}
              {modalConfig.mode === "ALERT" && <AlertCircle size={32} />}
              {modalConfig.mode === "SUCCESS" && <CheckCircle2 size={32} />}
            </div>

            <h4 className="modal-title">{modalConfig.title}</h4>

            {/* MODAL BODY */}
            {modalConfig.mode === "CONFIRM" ? (
              <div className="modal-body">
                <p>
                  Are you sure the <strong>{route.route_number}</strong> bus is{" "}
                  <strong style={{ color: brandPrimary }}>
                    {pendingVote === "low"
                      ? "Empty/Easy"
                      : pendingVote === "med"
                        ? "Standing Room"
                        : "Full"}
                  </strong>
                  ?
                </p>
                <div className="modal-note">
                  <span>
                    <strong>Note:</strong> To prevent spam, you can only submit{" "}
                    <strong>1 report every 15 minutes</strong>.
                  </span>
                </div>
              </div>
            ) : (
              <p className="modal-message">{modalConfig.message}</p>
            )}

            {/* MODAL ACTIONS */}
            <div className="modal-actions">
              {modalConfig.mode === "CONFIRM" ? (
                <>
                  <button className="modal-btn cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="modal-btn confirm"
                    onClick={confirmVote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Confirm"}
                  </button>
                </>
              ) : (
                <button className="modal-btn confirm" onClick={closeModal}>
                  Got it
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
