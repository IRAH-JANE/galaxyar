import React from "react";

function InfoPanel({ info }) {
  return (
    <div className="glass-panel info-panel">
      <h2>🪐 Planet Information</h2>

      {info ? (
        <>
          <h1>{info.name}</h1>
          <p>{info.desc}</p>

          <div className="planet-stats">
            <p>🌍 Gravity: {info.gravity}</p>
            <p>🌕 Moons: {info.moons}</p>
            <p>📏 Diameter: {info.diameter}</p>
            <p>🌡 Temperature: {info.temperature}</p>
            <p>☁️ Atmosphere: {info.atmosphere}</p>
            <p>🕒 Day Length: {info.dayLength}</p>
            <p>📅 Year Length: {info.yearLength}</p>
          </div>

          <div className="fact-box">
            <h3>🚀 NASA Fact</h3>
            <p>{info.nasaFact}</p>
          </div>

          <div className="fact-box">
            <h3>🌟 Fun Fact</h3>
            <p>{info.funFact}</p>
          </div>
        </>
      ) : (
        <p>
          Say <strong>"Hey Galaxy"</strong> then a planet name to begin.
        </p>
      )}
    </div>
  );
}

export default InfoPanel;
