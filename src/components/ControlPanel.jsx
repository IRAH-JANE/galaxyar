import React, { useState, forwardRef } from "react";

const ControlPanel = forwardRef(function ControlPanel(
  { listening, startVoice, stopVoice, zoom, setZoom, isPaused, setIsPaused },
  ref,
) {
  const [showCommands, setShowCommands] = useState(false);

  return (
    <div className="glass-panel control-panel" ref={ref}>
      <h2>🚀 GalaxyAR</h2>

      <button
        className="galaxy-btn"
        onClick={() => (listening ? stopVoice() : startVoice())}
      >
        {listening ? "🎙 Stop Voice" : "🎙 Start Voice"}
      </button>

      <button className="galaxy-btn" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "▶ Resume" : "⏸ Pause"}
      </button>

      <div className="slider-group">
        <p>Zoom: {zoom.toFixed(1)}x</p>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(+e.target.value)}
        />
      </div>

      <button
        className="galaxy-btn cmd-toggle"
        onClick={() => setShowCommands((v) => !v)}
      >
        {showCommands ? "▲ Hide Commands" : "▼ Voice Commands"}
      </button>

      {showCommands && (
        <div className="commands">
          <ul>
            <li>
              <strong>Hey Galaxy</strong> — wake up
            </li>
            <li>
              <strong>Goodbye / Sleep</strong> — sleep
            </li>
            <li>
              <strong>[Planet name]</strong> — show info
            </li>
            <li>
              <strong>How many moons [planet]</strong>
            </li>
            <li>
              <strong>Temperature of [planet]</strong>
            </li>
            <li>
              <strong>Gravity of [planet]</strong>
            </li>
            <li>
              <strong>Atmosphere of [planet]</strong>
            </li>
            <li>
              <strong>Fun fact [planet]</strong>
            </li>
            <li>
              <strong>Zoom in / Zoom out</strong>
            </li>
            <li>
              <strong>Pause / Resume</strong>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
});

export default ControlPanel;
