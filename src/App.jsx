import React, { useState, useEffect } from "react";

function App() {
  const [info, setInfo] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const planetData = {
    Mercury: {
      dist: "57.9M km",
      temp: "167°C",
      size: "4,879 km",
      texture: "/textures/mercury.jpg",
      desc: "Smallest planet, closest to the Sun.",
    },
    Venus: {
      dist: "108.2M km",
      temp: "464°C",
      size: "12,104 km",
      texture: "/textures/venus.jpg",
      desc: "Hottest planet due to thick atmosphere.",
    },
    Earth: {
      dist: "149.6M km",
      temp: "15°C",
      size: "12,742 km",
      texture: "/textures/earth.jpg",
      desc: "Our home planet and the only one with life.",
    },
    Mars: {
      dist: "227.9M km",
      temp: "-65°C",
      size: "6,779 km",
      texture: "/textures/mars.jpg",
      desc: "The Red Planet, home to Olympus Mons.",
    },
    Jupiter: {
      dist: "778.5M km",
      temp: "-110°C",
      size: "139,820 km",
      texture: "/textures/jupiter.jpg",
      desc: "Largest planet with a Great Red Spot.",
    },
    Saturn: {
      dist: "1.4B km",
      temp: "-140°C",
      size: "116,460 km",
      texture: "/textures/saturn.jpg",
      desc: "Famous for its spectacular ring system.",
    },
    Uranus: {
      dist: "2.9B km",
      temp: "-195°C",
      size: "50,724 km",
      texture: "/textures/uranus.jpg",
      desc: "An ice giant that rotates on its side.",
    },
    Neptune: {
      dist: "4.5B km",
      temp: "-201°C",
      size: "49,244 km",
      texture: "/textures/neptune.jpg",
      desc: "The most distant and windiest planet.",
    },
  };

  const handlePlanetClick = (name) => {
    setInfo({ name, ...planetData[name] });
  };

  const distances = [1.0, 1.4, 1.9, 2.5, 3.5, 4.5, 5.5, 6.3];
  // Calculate speeds based on timeScale and pause state
  const baseSpeeds = [6000, 9000, 12000, 16000, 25000, 32000, 40000, 45000];
  const speeds = baseSpeeds.map((s) => (isPaused ? 0 : s / timeScale));
  const sizes = [0.1, 0.18, 0.22, 0.15, 0.45, 0.35, 0.3, 0.28];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* --- CONTROL CENTER (Left Side) --- */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Time Controls */}
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "cyan" }}>
            ⏱ Time Control
          </h4>
          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              width: "100%",
              padding: "8px",
              cursor: "pointer",
              background: isPaused ? "#28a745" : "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {isPaused ? "▶ Play Orbits" : "⏸ Pause Orbits"}
          </button>
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontSize: "12px" }}>Warp Speed: {timeScale}x</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timeScale}
              onChange={(e) => setTimeScale(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Layer Toggles */}
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "cyan" }}>
            📡 View Layers
          </h4>
          <label
            style={{ display: "block", fontSize: "14px", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={() => setShowOrbits(!showOrbits)}
            />{" "}
            Show Orbits
          </label>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "5px",
            }}
          >
            <input
              type="checkbox"
              checked={showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />{" "}
            Show Labels
          </label>
        </div>
      </div>

      {/* --- ZOOM SLIDER (Bottom) --- */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "rgba(0,0,0,0.8)",
          padding: "10px 25px",
          borderRadius: "30px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span>🔍 Zoom</span>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
      </div>

      {/* --- INFO CARD (Right) --- */}
      {info && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
            width: "260px",
            backgroundColor: "rgba(0,0,0,0.9)",
            color: "white",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid cyan",
          }}
        >
          <button
            onClick={() => setInfo(null)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <h2 style={{ margin: "0 0 10px 0", borderBottom: "1px solid cyan" }}>
            {info.name}
          </h2>
          <p>
            <strong>Temp:</strong> {info.temp}
          </p>
          <p>
            <strong>Size:</strong> {info.size}
          </p>
          <p>
            <strong>Dist:</strong> {info.dist}
          </p>
          <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.4" }}>
            {info.desc}
          </p>
        </div>
      )}

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
      >
        <a-light type="ambient" intensity="1.2"></a-light>
        <a-light type="point" position="0 0 0" intensity="2"></a-light>

        <a-marker preset="hiro">
          <a-entity id="solar-system" scale={`${zoom} ${zoom} ${zoom}`}>
            <a-sphere
              radius="0.6"
              material="src: url(/textures/sun.jpg); emissive: #ffaa00; emissiveIntensity: 1"
            ></a-sphere>

            {Object.keys(planetData).map((name, index) => {
              const planet = planetData[name];
              return (
                <React.Fragment key={name}>
                  {/* Orbit Ring */}
                  {showOrbits && (
                    <a-ring
                      rotation="-90 0 0"
                      radius-inner={distances[index] - 0.01}
                      radius-outer={distances[index] + 0.01}
                      material="color: cyan; opacity: 0.2"
                    ></a-ring>
                  )}

                  <a-entity
                    animation={
                      !isPaused
                        ? `property: rotation; to: 0 360 0; loop: true; dur: ${speeds[index]}; easing: linear`
                        : ""
                    }
                  >
                    <a-entity position={`${distances[index]} 0.5 0`}>
                      {/* Planet Label */}
                      {showLabels && (
                        <a-text
                          value={name}
                          position="0 0.5 0"
                          align="center"
                          scale="0.4 0.4 0.4"
                          look-at="[camera]"
                        ></a-text>
                      )}

                      <a-sphere
                        class="clickable"
                        radius={sizes[index]}
                        onClick={() => handlePlanetClick(name)}
                        material={`src: url(${planet.texture}); roughness: 0.8`}
                      ></a-sphere>

                      {name === "Earth" && (
                        <a-sphere
                          radius={sizes[index] + 0.01}
                          material="src: url(/textures/earth_clouds.png); transparent: true; opacity: 0.5"
                          animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
                        ></a-sphere>
                      )}

                      {name === "Saturn" && (
                        <a-ring
                          radius-inner={sizes[index] + 0.05}
                          radius-outer={sizes[index] + 0.35}
                          rotation="-80 0 0"
                          material="src: url(/textures/saturn_ring.png); transparent: true; opacity: 0.7"
                        ></a-ring>
                      )}
                    </a-entity>
                  </a-entity>
                </React.Fragment>
              );
            })}
          </a-entity>
        </a-marker>

        <a-entity camera>
          <a-cursor
            raycaster="objects: .clickable"
            cursor="rayOrigin: mouse"
          ></a-cursor>
        </a-entity>
      </a-scene>
    </div>
  );
}

export default App;
