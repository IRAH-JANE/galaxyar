import React from "react";

const glowColors = {
  Mercury: "#aaaaaa",
  Venus: "#ddaa44",
  Earth: "#2266cc",
  Mars: "#cc3300",
  Jupiter: "#cc8844",
  Saturn: "#ddcc77",
  Uranus: "#44cccc",
  Neptune: "#2244cc",
};

const ringPlanets = {
  Saturn: { radius: 0.1, tube: 0.022, color: "#c8b080", opacity: 0.75 },
  Uranus: { radius: 0.08, tube: 0.012, color: "#88cccc", opacity: 0.45 },
};

function Planet({ planet, angle }) {
  // Orbit position on the XZ plane (Y=0), raised slightly so it sits above marker
  const x = planet.distance * Math.cos(angle);
  const z = planet.distance * Math.sin(angle);
  const glow = glowColors[planet.name] || "#ffffff";
  const ring = ringPlanets[planet.name];

  return (
    <a-entity position={`${x} 0.05 ${z}`}>
      {/* Atmosphere glow — NOT clickable, no class="clickable" */}
      <a-sphere
        radius={planet.size * 1.35}
        material={`color: ${glow}; opacity: 0.14; transparent: true; shader: flat; side: back;`}
      />

      {/*
       * Planet body.
       * class="clickable" — required for raycaster to detect it.
       * data-planet — required for the click handler to know which planet.
       */}
      <a-sphere
        class="clickable"
        data-planet={planet.name}
        radius={planet.size}
        material={`src: ${planet.texture}; roughness: 0.9; metalness: 0.0;`}
        animation="property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 8000; easing: linear;"
      />

      {/*
       * Invisible larger hit sphere — makes small planets easier to tap on mobile.
       * Also needs class="clickable" and data-planet so clicks register.
       */}
      <a-sphere
        class="clickable"
        data-planet={planet.name}
        radius={planet.size * 2.2}
        material="opacity: 0; transparent: true;"
      />

      {/* Rings (Saturn / Uranus only) */}
      {ring && (
        <a-torus
          radius={ring.radius}
          radius-tubular={ring.tube}
          segments-tubular="60"
          segments-radial="6"
          rotation="80 0 0"
          material={`color: ${ring.color}; opacity: ${ring.opacity}; transparent: true; side: double;`}
        />
      )}

      {/* Planet name label — look-at keeps it facing camera */}
      <a-text
        value={planet.name}
        position={`0 ${planet.size + 0.045} 0`}
        scale="0.07 0.07 0.07"
        align="center"
        color="#ffffff"
        shader="flat"
        look-at="[camera]"
      />
    </a-entity>
  );
}

export default Planet;
