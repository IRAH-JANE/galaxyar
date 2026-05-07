import React, { useState, forwardRef } from "react";

const ControlPanel = forwardRef(function ControlPanel(
  { listening, startVoice, stopVoice, isPaused, setIsPaused },
  ref,
) {
  const [showCmds, setShowCmds] = useState(false);

  return (
    <div className="ctrl-panel" ref={ref}>
      <h2 className="ctrl-title">🚀 GalaxyAR</h2>

      <button
        className="ctrl-btn"
        onClick={() => (listening ? stopVoice() : startVoice())}
      >
        {listening ? "🎙 Stop Voice" : "🎙 Start Voice"}
      </button>

      <button className="ctrl-btn" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "▶ Resume" : "⏸ Pause"}
      </button>

      <button
        className="ctrl-btn ctrl-btn--subtle"
        onClick={() => setShowCmds((v) => !v)}
      >
        {showCmds ? "▲ Hide Commands" : "▼ Voice Commands"}
      </button>

      {showCmds && (
        <div className="ctrl-cmds">
          <div className="ctrl-cmd">
            <strong>Hey Galaxy</strong> — wake up
          </div>
          <div className="ctrl-cmd">
            <strong>Goodbye / Sleep</strong> — sleep
          </div>
          <div className="ctrl-cmd">
            <strong>[Planet name]</strong> — focus planet
          </div>
          <div className="ctrl-cmd">
            <strong>Moons / Temperature / Gravity...</strong>
          </div>
          <div className="ctrl-cmd">
            <strong>Pause / Resume</strong> — orbits
          </div>
        </div>
      )}
    </div>
  );
});

export default ControlPanel;
