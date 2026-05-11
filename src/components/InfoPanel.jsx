import React from "react";

function InfoPanel({ info, onFocus }) {
  if (!info) {
    return (
      <div className="glass-panel info-panel">
        <div className="info-panel-label">🪐 Planet Info</div>
        <p className="info-empty">
          Say <strong>"Hey Galaxy"</strong> plus a planet name, or tap a planet.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel info-panel">
      <div className="info-panel-label">🪐 Planet Info</div>

      <div className="info-header-row">
        <h1 className="info-planet-name">{info.name}</h1>
        <button className="info-view-btn" onClick={onFocus}>
          View 3D →
        </button>
      </div>

      <p className="info-desc">{info.desc}</p>
    </div>
  );
}

export default InfoPanel;
