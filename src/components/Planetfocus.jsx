import React, { useEffect, useRef } from "react";

function PlanetFocus({ planet, onClose }) {
  const sphereRef = useRef(null);
  const rot = useRef({
    x: -15,
    y: 0,
    dragging: false,
    lx: 0,
    ly: 0,
    vx: 0,
    vy: 0,
  });
  const raf = useRef(null);

  // Spinning globe
  useEffect(() => {
    const spin = () => {
      const r = rot.current;
      if (!r.dragging) {
        r.vx *= 0.92;
        r.vy *= 0.92;
        r.y += r.vx + 0.22;
        r.x += r.vy;
        r.x = Math.max(-55, Math.min(55, r.x));
      }
      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
      }
      raf.current = requestAnimationFrame(spin);
    };
    spin();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const onPD = (e) => {
    const r = rot.current;
    r.dragging = true;
    r.lx = e.clientX;
    r.ly = e.clientY;
    r.vx = 0;
    r.vy = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPM = (e) => {
    const r = rot.current;
    if (!r.dragging) return;
    const dx = e.clientX - r.lx,
      dy = e.clientY - r.ly;
    r.vx = dx * 0.42;
    r.vy = dy * 0.42;
    r.y += dx * 0.42;
    r.x += dy * 0.42;
    r.x = Math.max(-70, Math.min(70, r.x));
    r.lx = e.clientX;
    r.ly = e.clientY;
  };
  const onPU = () => {
    rot.current.dragging = false;
  };

  const glowColor = planet.color || "#4488ff";

  const stats = [
    { icon: "🌍", label: "Gravity", value: planet.gravity },
    { icon: "🌕", label: "Moons", value: String(planet.moons) },
    { icon: "📏", label: "Diameter", value: planet.diameter },
    { icon: "🌡", label: "Temperature", value: planet.temperature },
    { icon: "☁️", label: "Atmosphere", value: planet.atmosphere },
    { icon: "🕒", label: "Day Length", value: planet.dayLength },
    { icon: "📅", label: "Year Length", value: planet.yearLength },
  ];

  return (
    <div className="focus-overlay">
      {/* ════ LEFT — 3D Globe ════ */}
      <div className="focus-left">
        {/* Back button */}
        <button className="focus-back-btn" onClick={onClose}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to AR
        </button>

        {/* Space background radial glow */}
        <div
          className="focus-space-bg"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${glowColor}22 0%, transparent 65%)`,
          }}
        />

        {/* 3D spinning globe */}
        <div
          className="focus-globe-scene"
          onPointerDown={onPD}
          onPointerMove={onPM}
          onPointerUp={onPU}
          onPointerLeave={onPU}
          style={{ cursor: "grab" }}
        >
          {/* Atmosphere ring */}
          <div
            className="focus-atmo"
            style={{ boxShadow: `0 0 90px 35px ${glowColor}44` }}
          />

          {/* The globe itself */}
          <div
            ref={sphereRef}
            className="focus-globe"
            style={{
              backgroundImage: `url(${planet.texture})`,
              boxShadow: `
                inset -35px -18px 70px rgba(0,0,0,0.85),
                inset 18px 9px 45px rgba(255,255,255,0.04),
                0 0 70px 15px ${glowColor}33
              `,
            }}
          />
        </div>

        <p className="focus-drag-hint">🖱 Drag to rotate</p>

        {/* Planet name */}
        <h1 className="focus-planet-name" style={{ color: glowColor }}>
          {planet.name}
        </h1>
        <p className="focus-planet-desc">{planet.desc}</p>
      </div>

      {/* ════ RIGHT — Info ════ */}
      <div className="focus-right">
        <div className="focus-right-scroll">
          <p className="focus-section-tag">PLANET STATS</p>

          <div className="focus-stats-grid">
            {stats.map(({ icon, label, value }) => (
              <div key={label} className="focus-stat-card">
                <div className="focus-stat-icon">{icon}</div>
                <div className="focus-stat-label">{label}</div>
                <div className="focus-stat-value">{value}</div>
              </div>
            ))}
          </div>

          {planet.nasaFact && (
            <>
              <p className="focus-section-tag" style={{ marginTop: 22 }}>
                NASA FACT
              </p>
              <div className="focus-fact nasa-fact">
                <span className="focus-fact-emoji">🚀</span>
                <p>{planet.nasaFact}</p>
              </div>
            </>
          )}

          {planet.funFact && (
            <>
              <p className="focus-section-tag" style={{ marginTop: 14 }}>
                FUN FACT
              </p>
              <div className="focus-fact fun-fact">
                <span className="focus-fact-emoji">🌟</span>
                <p>{planet.funFact}</p>
              </div>
            </>
          )}

          {/* Bottom back — thumb reachable on mobile */}
          <button className="focus-back-bottom" onClick={onClose}>
            ← Back to Solar System
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanetFocus;
