import React from "react";

// Atmospheric glow colors per planet
const glowColors = {
  Mercury: "#888888",
  Venus: "#ddaa44",
  Earth: "#2266cc",
  Mars: "#cc3300",
  Jupiter: "#cc8844",
  Saturn: "#ddcc77",
  Uranus: "#44cccc",
  Neptune: "#2244cc",
};

// Ring data — only Saturn and Uranus have rings
const ringPlanets = {
  Saturn: {
    innerRadius: 0.38,
    outerRadius: 0.65,
    color: "#c8b080",
    opacity: 0.75,
  },
  Uranus: {
    innerRadius: 0.3,
    outerRadius: 0.42,
    color: "#88cccc",
    opacity: 0.4,
  },
};

function Planet({ planet, angle }) {
  const x = planet.distance * Math.cos(angle);
  const z = planet.distance * Math.sin(angle);
  const glow = glowColors[planet.name] || "#ffffff";
  const ring = ringPlanets[planet.name];

  return (
    <a-entity position={`${x} 0 ${z}`}>
      {/* ── ATMOSPHERE HALO ── */}
      <a-sphere
        radius={planet.size * 1.35}
        material={`
          color: ${glow};
          opacity: 0.18;
          transparent: true;
          shader: flat;
          side: back;
        `}
      />

      {/* ── PLANET BODY ── */}
      <a-sphere
        radius={planet.size}
        material={`
          src: ${planet.texture};
          roughness: 0.85;
          metalness: 0.05;
          normalTextureRepeat: 2 2;
        `}
        animation="property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 8000; easing: linear;"
      />

      {/* ── RINGS (Saturn / Uranus) ── */}
      {ring && (
        <a-torus
          radius={(ring.innerRadius + ring.outerRadius) / 2}
          radius-tubular={((ring.outerRadius - ring.innerRadius) / 2).toFixed(
            3,
          )}
          segments-tubular="60"
          segments-radial="6"
          rotation="80 0 0"
          material={`
            color: ${ring.color};
            opacity: ${ring.opacity};
            transparent: true;
            roughness: 1;
            side: double;
          `}
        />
      )}

      {/* ── PLANET LABEL ── */}
      <a-text
        value={planet.name}
        position={`0 ${planet.size + 0.18} 0`}
        align="center"
        color="#ffffff"
        opacity="0.85"
        scale="0.38 0.38 0.38"
        look-at="#camera"
        shader="flat"
      />

      {/* ── SUBTLE POINT LIGHT per planet (gives color cast) ── */}
      <a-light
        type="point"
        color={glow}
        intensity="0.25"
        distance="1.2"
        decay="2"
      />
    </a-entity>
  );
}

export default Planet;
