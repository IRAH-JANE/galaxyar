import React from "react";

function InfoPanel({ info, onFocus }) {
  return (
    <div className="glass-panel info-panel">
      <div className="info-panel-label">🪐 Planet Info</div>

      {info ? (
        <>
          <div className="info-header-row">
            <h1 className="info-planet-name">{info.name}</h1>
            <button className="info-view-btn" onClick={onFocus}>
              View 3D →
            </button>
          </div>

          <p className="info-desc">{info.desc}</p>

          <div className="info-stats">
            <div className="info-stat">
              <span>🌍</span>
              <span>{info.gravity}</span>
            </div>
            <div className="info-stat">
              <span>🌕</span>
              <span>
                {info.moons} moon{info.moons !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="info-stat">
              <span>📏</span>
              <span>{info.diameter}</span>
            </div>
            <div className="info-stat">
              <span>🌡</span>
              <span>{info.temperature}</span>
            </div>
            <div className="info-stat">
              <span>🕒</span>
              <span>{info.dayLength}</span>
            </div>
            <div className="info-stat">
              <span>📅</span>
              <span>{info.yearLength}</span>
            </div>
          </div>

          <div className="info-fact">
            <div className="info-fact-title">🌟 Fun Fact</div>
            <p>{info.funFact}</p>
          </div>
        </>
      ) : (
        <p className="info-empty">
          Say <strong>"Hey Galaxy"</strong> + a planet name, or tap a planet in
          AR.
        </p>
      )}
    </div>
  );
}

export default InfoPanel;
