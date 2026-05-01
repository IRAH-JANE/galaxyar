import React, { useState } from "react";

function App() {
  const [info, setInfo] = useState(null);

  const planetData = {
    Mercury: {
      dist: "57.9M km",
      temp: "167°C",
      size: "4,879 km",
      texture: "/textures/mercury.jpg",
    },
    Venus: {
      dist: "108.2M km",
      temp: "464°C",
      size: "12,104 km",
      texture: "/textures/venus.jpg",
    },
    Earth: {
      dist: "149.6M km",
      temp: "15°C",
      size: "12,742 km",
      texture: "/textures/earth.jpg",
    },
    Mars: {
      dist: "227.9M km",
      temp: "-65°C",
      size: "6,779 km",
      texture: "/textures/mars.jpg",
    },
    Jupiter: {
      dist: "778.5M km",
      temp: "-110°C",
      size: "139,820 km",
      texture: "/textures/jupiter.jpg",
    },
    Saturn: {
      dist: "1.4B km",
      temp: "-140°C",
      size: "116,460 km",
      texture: "/textures/saturn.jpg",
    },
    Uranus: {
      dist: "2.9B km",
      temp: "-195°C",
      size: "50,724 km",
      texture: "/textures/uranus.jpg",
    },
    Neptune: {
      dist: "4.5B km",
      temp: "-201°C",
      size: "49,244 km",
      texture: "/textures/neptune.jpg",
    },
  };

  const handlePlanetClick = (name) => {
    setInfo({ name, ...planetData[name] });
  };

  const distances = [1.0, 1.4, 1.9, 2.5, 3.5, 4.5, 5.5, 6.3];
  const speeds = [6000, 9000, 12000, 16000, 25000, 32000, 40000, 45000];
  const sizes = [0.1, 0.18, 0.22, 0.15, 0.45, 0.35, 0.3, 0.28];

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* INFO CARD */}
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
          }}
        >
          <button onClick={() => setInfo(null)}>✕</button>
          <h2>{info.name}</h2>
          <p>🌡️ {info.temp}</p>
          <p>📏 {info.size}</p>
          <p>📍 {info.dist}</p>
        </div>
      )}

      <a-scene
        embedded
        arjs="sourceType: webcam;"
        vr-mode-ui="enabled: false"
        gesture-detector
      >
        {/* LIGHTS */}
        <a-light type="ambient" intensity="1.2"></a-light>
        <a-light type="point" position="0 0 0" intensity="2"></a-light>

        <a-marker preset="hiro">
          <a-entity id="solar-system" gesture-handler>
            {/* 🌌 STARS */}
            <a-sphere
              radius="50"
              scale="-1 1 1"
              material="src: url(/textures/stars.jpg); side: back; shader: flat;"
            ></a-sphere>

            {/* ☀️ SUN */}
            <a-sphere
              radius="0.6"
              material="src: url(/textures/sun.jpg); emissive: #ffaa00; emissiveIntensity: 1"
            ></a-sphere>

            {/* ORBITS */}
            {distances.map((d, i) => (
              <a-ring
                key={i}
                rotation="-90 0 0"
                radius-inner={d - 0.005}
                radius-outer={d + 0.005}
                material="color: cyan; opacity: 0.3"
              ></a-ring>
            ))}

            {/* PLANETS */}
            {Object.keys(planetData).map((name, index) => {
              const planet = planetData[name];

              return (
                <a-entity
                  key={name}
                  animation={`property: rotation; to: 0 360 0; loop: true; dur: ${speeds[index]}; easing: linear`}
                >
                  <a-entity position={`${distances[index]} 0.5 0`}>
                    {/* PLANET */}
                    <a-sphere
                      class="clickable"
                      radius={sizes[index]}
                      onClick={() => handlePlanetClick(name)}
                      material={`src: url(${planet.texture}); roughness: 0.8`}
                    ></a-sphere>

                    {/* EARTH SYSTEM */}
                    {name === "Earth" && (
                      <>
                        {/* CLOUDS */}
                        <a-sphere
                          radius={sizes[index] + 0.01}
                          material="src: url(/textures/earth_clouds.png); transparent: true; opacity: 0.8"
                          animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
                        ></a-sphere>

                        {/* MOON */}
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

                    {/* SATURN RING */}
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

        {/* CURSOR */}
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
