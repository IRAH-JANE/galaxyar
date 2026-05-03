import React, { useEffect, useState } from "react";
import Planet from "./Planet";

function ARScene({ planets, zoom, isPaused }) {
  const [angles, setAngles] = useState(
    new Array(Object.keys(planets).length).fill(0),
  );

  useEffect(() => {
    let frame;
    const speeds = Object.values(planets).map((p) => p.speed);

    const animate = () => {
      if (!isPaused) {
        setAngles((prev) => prev.map((a, i) => a + speeds[i]));
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isPaused, planets]);

  useEffect(() => {
    const cam = document.querySelector("#camera");
    if (cam) {
      cam.setAttribute("position", `0 1.6 ${5 - zoom * 1.5}`);
    }
  }, [zoom]);

  return (
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
      arjs="sourceType: webcam; debugUIEnabled: false;"
    >
      {/* LIGHTS */}
      <a-light type="ambient" intensity="1.2" />
      <a-light type="point" intensity="2" position="0 3 0" />

      {/* HIRO MARKER */}
      <a-marker preset="hiro">
        {/* SUN */}
        <a-sphere
          radius="0.5"
          material="src:/textures/sun.jpg; emissive:#ffaa00;"
        />

        {/* ORBIT RINGS */}
        {Object.values(planets).map((planet, i) => (
          <a-torus
            key={`orbit-${i}`}
            radius={planet.distance}
            radius-tubular="0.004"
            segments-tubular="80"
            rotation="-90 0 0"
            material="color: rgba(255,255,255,0.15); shader: flat;"
          />
        ))}

        {/* PLANETS */}
        {Object.entries(planets).map(([name, planet], i) => (
          <Planet key={name} planet={{ ...planet, name }} angle={angles[i]} />
        ))}
      </a-marker>

      {/* CAMERA */}
      <a-entity id="camera" camera />
    </a-scene>
  );
}

export default ARScene;
