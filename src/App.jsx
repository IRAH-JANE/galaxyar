import React, { useState } from "react";

function App() {
  const [info, setInfo] = useState(null);
  const [zoom, setZoom] = useState(1); // 🟢 New: Zoom state (1 is default)

  const planetData = {
    Mercury: {
      dist: "57.9M km",
      temp: "167°C",
      size: "4,879 km",
      texture: "/textures/mercury.jpg",
      desc: "The smallest planet and closest to the Sun.",
    },
    Venus: {
      dist: "108.2M km",
      temp: "464°C",
      size: "12,104 km",
      texture: "/textures/venus.jpg",
      desc: "Spinning slowly in the opposite direction from most planets.",
    },
    Earth: {
      dist: "149.6M km",
      temp: "15°C",
      size: "12,742 km",
      texture: "/textures/earth.jpg",
      desc: "The only world known to harbor life.",
    },
    Mars: {
      dist: "227.9M km",
      temp: "-65°C",
      size: "6,779 km",
      texture: "/textures/mars.jpg",
      desc: "A dusty, cold, desert world with a very thin atmosphere.",
    },
    Jupiter: {
      dist: "778.5M km",
      temp: "-110°C",
      size: "139,820 km",
      texture: "/textures/jupiter.jpg",
      desc: "More than twice as massive as the other planets combined.",
    },
    Saturn: {
      dist: "1.4B km",
      temp: "-140°C",
      size: "116,460 km",
      texture: "/textures/saturn.jpg",
      desc: "Adorned with a dazzling, complex system of icy rings.",
    },
    Uranus: {
      dist: "2.9B km",
      temp: "-195°C",
      size: "50,724 km",
      texture: "/textures/uranus.jpg",
      desc: "Rotates at a nearly 90-degree angle from the plane of its orbit.",
    },
    Neptune: {
      dist: "4.5B km",
      temp: "-201°C",
      size: "49,244 km",
      texture: "/textures/neptune.jpg",
      desc: "The eighth and most distant major planet orbiting our Sun.",
    },
  };

  const handlePlanetClick = (name) => {
    setInfo({ name, ...planetData[name] });
  };

  const distances = [1.0, 1.4, 1.9, 2.5, 3.5, 4.5, 5.5, 6.3];
  const speeds = [6000, 9000, 12000, 16000, 25000, 32000, 40000, 45000];
  const sizes = [0.1, 0.18, 0.22, 0.15, 0.45, 0.35, 0.3, 0.28];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* 🟢 NEW: ZOOM SLIDER UI */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "rgba(0,0,0,0.7)",
          padding: "10px 20px",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "white",
        }}
      >
        <span style={{ fontSize: "12px" }}>Zoom</span>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* INFO CARD (Updated with description) */}
      {info && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
            width: "280px",
            backgroundColor: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <button
            onClick={() => setInfo(null)}
            style={{
              float: "right",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <h2 style={{ marginTop: 0 }}>{info.name}</h2>
          <p>
            🌡️ <strong>Temp:</strong> {info.temp}
          </p>
          <p>
            📏 <strong>Size:</strong> {info.size}
          </p>
          <p>
            📍 <strong>Distance:</strong> {info.dist}
          </p>
          <p
            style={{
              fontSize: "14px",
              borderTop: "1px solid #444",
              paddingTop: "10px",
              color: "#ccc",
            }}
          >
            {info.desc}
          </p>
        </div>
      )}

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
        gesture-detector
      >
        <a-light type="ambient" intensity="1.2"></a-light>
        <a-light type="point" position="0 0 0" intensity="2"></a-light>

        <a-marker preset="hiro">
          {/* 🟢 MODIFIED: Added scale attribute linked to zoom state */}
          <a-entity
            id="solar-system"
            gesture-handler
            scale={`${zoom} ${zoom} ${zoom}`}
          >
            <a-sphere
              radius="50"
              scale="-1 1 1"
              material="src: url(/textures/stars.jpg); side: back; shader: flat; transparent: true; opacity: 0.6"
            ></a-sphere>

            <a-sphere
              radius="0.6"
              material="src: url(/textures/sun.jpg); emissive: #ffaa00; emissiveIntensity: 1"
            ></a-sphere>

            {distances.map((d, i) => (
              <a-ring
                key={i}
                rotation="-90 0 0"
                radius-inner={d - 0.005}
                radius-outer={d + 0.005}
                material="color: cyan; opacity: 0.3"
              ></a-ring>
            ))}

            {Object.keys(planetData).map((name, index) => {
              const planet = planetData[name];
              return (
                <a-entity
                  key={name}
                  animation={`property: rotation; to: 0 360 0; loop: true; dur: ${speeds[index]}; easing: linear`}
                >
                  <a-entity position={`${distances[index]} 0.5 0`}>
                    <a-sphere
                      class="clickable"
                      radius={sizes[index]}
                      onClick={() => handlePlanetClick(name)}
                      material={`src: url(${planet.texture}); roughness: 0.8`}
                    ></a-sphere>

                    {name === "Earth" && (
                      <>
                        <a-sphere
                          radius={sizes[index] + 0.01}
                          material="src: url(/textures/earth_clouds.png); transparent: true; opacity: 0.8"
                          animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
                        ></a-sphere>
                        <a-entity animation="property: rotation; to: 0 360 0; loop: true; dur: 4000">
                          <a-entity position="0.4 0 0">
                            <a-sphere
                              radius="0.05"
                              material="src: url(/textures/moon.jpg); roughness: 1; metalness: 0.1"
                            ></a-sphere>
                          </a-entity>
                        </a-entity>
                      </>
                    )}

                    {name === "Saturn" && (
                      <a-ring
                        radius-inner={sizes[index] + 0.05}
                        radius-outer={sizes[index] + 0.35}
                        rotation="-80 0 0"
                        material="src: url(/textures/saturn_ring.png); transparent: true; opacity: 0.9"
                      ></a-ring>
                    )}
                  </a-entity>
                </a-entity>
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
