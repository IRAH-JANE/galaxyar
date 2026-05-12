import React, { forwardRef, useState } from "react";

const ControlPanel = forwardRef(function ControlPanel(
  {
    listening,
    startVoice,
    stopVoice,
    isPaused,
    setIsPaused,
    onShowGalaxy,
    onShowSolar,
    onUseHiro,
    onOpenScanner,
    onOpenQuiz,
  },
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

      <button
        className="ctrl-btn"
        onClick={() => setIsPaused(!isPaused)}
        style={{
          background: isPaused
            ? "rgba(76, 175, 80, 0.2)"
            : "rgba(255, 255, 255, 0.07)",
          borderColor: isPaused
            ? "rgba(76, 175, 80, 0.4)"
            : "rgba(255, 255, 255, 0.1)",
        }}
      >
        {isPaused ? "▶ Resume" : "⏸ Pause"}
      </button>

      <button className="ctrl-btn" onClick={onShowGalaxy}>
        🌌 Show Galaxy
      </button>

      <button className="ctrl-btn" onClick={onShowSolar}>
        🪐 Show Solar
      </button>

      <button className="ctrl-btn" onClick={onOpenScanner}>
        📷 Planet Scanner
      </button>

      <button className="ctrl-btn" onClick={onOpenQuiz}>
        🧠 Quiz Mode
      </button>

      <button className="ctrl-btn ctrl-btn--subtle" onClick={onUseHiro}>
        📷 Use HIRO Marker
      </button>

      <button
        className="ctrl-btn ctrl-btn--subtle"
        onClick={() => setShowCmds((value) => !value)}
      >
        {showCmds ? "▲ Hide Commands" : "▼ Voice Commands"}
      </button>

      {showCmds && (
        <div className="ctrl-cmds">
          <div className="ctrl-cmd">
            <strong>Hey Galaxy</strong> — wake up
          </div>
          <div className="ctrl-cmd">
            <strong>Hey Galaxy, show galaxy</strong> — Milky Way view
          </div>
          <div className="ctrl-cmd">
            <strong>Hey Galaxy, show solar system</strong> — free solar view
          </div>
          <div className="ctrl-cmd">
            <strong>Hey Galaxy, scan planet</strong> — Planet Scanner
          </div>
          <div className="ctrl-cmd">
            <strong>[Planet name]</strong> — open 3D info
          </div>
          <div className="ctrl-cmd">
            <strong>How many moons does Mars have?</strong> — quick answer box
          </div>
          <div className="ctrl-cmd">
            <strong>Temperature / Gravity / Diameter</strong> — quick facts
          </div>
          <div className="ctrl-cmd">
            <strong>Quiz mode</strong> — start quiz
          </div>
          <div className="ctrl-cmd">
            <strong>Pause / Resume</strong> — orbits
          </div>
          <div className="ctrl-cmd">
            <strong>Goodbye / Sleep</strong> — sleep
          </div>
        </div>
      )}
    </div>
  );
});

export default ControlPanel;
