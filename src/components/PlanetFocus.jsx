import React, { useEffect, useMemo, useState } from "react";

function ordinal(n) {
  if (n === 0) return "Center of the Solar System";
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function texturePath(texture) {
  if (!texture) return "";
  if (texture.startsWith("/")) return texture;
  return `/${texture}`;
}

function valueOrDash(value) {
  return value === undefined || value === null || value === "" ? "—" : value;
}

function FactChip({ label, value, delay = 0 }) {
  return (
    <div className="pf3-chip pf3-anim-item" style={{ "--i": String(delay) }}>
      <span>{label}</span>
      <strong>{valueOrDash(value)}</strong>
    </div>
  );
}

function InfoRow({ label, value, delay = 0 }) {
  return (
    <div className="pf3-row pf3-anim-item" style={{ "--i": String(delay) }}>
      <span>{label}</span>
      <p>{valueOrDash(value)}</p>
    </div>
  );
}

function PlanetViewer({ planet }) {
  const texture = useMemo(() => texturePath(planet.texture), [planet.texture]);
  const isSun = planet.name === "Sun";
  const hasRings = Boolean(planet.rings);

  return (
    <div
      className={`pf3-viewer ${isSun ? "pf3-viewer--sun" : ""}`}
      style={{
        "--planet-color": planet.color || "#7ca0ff",
        "--planet-glow":
          planet.glowColor || planet.color || (isSun ? "#ff9a2f" : "#7ca0ff"),
        "--planet-texture": texture ? `url("${texture}")` : "none",
      }}
    >
      <div className="pf3-portal-flare" />
      <div className="pf3-stars" />
      <div className="pf3-orbit pf3-orbit-1" />
      <div className="pf3-orbit pf3-orbit-2" />
      <div className="pf3-orbit pf3-orbit-3" />

      <div className="pf3-planet-stage">
        {hasRings && <div className="pf3-rings pf3-rings-back" />}

        <div className={`pf3-globe ${isSun ? "pf3-globe--sun" : ""}`}>
          <div className="pf3-globe-shine" />
          <div className="pf3-globe-shade" />
        </div>

        {hasRings && <div className="pf3-rings pf3-rings-front" />}
      </div>

      <div className="pf3-viewer-label">3D Planet Preview</div>
    </div>
  );
}

function PlanetFocus({ planet, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setClosing(false);
  }, [planet.name]);

  function handleClose() {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 320);
  }

  const positionText =
    planet.orderFromSun === 0
      ? "Center star of the Solar System"
      : `${ordinal(planet.orderFromSun)} planet from the Sun`;

  const headline =
    planet.name === "Sun"
      ? "The star that powers and holds the Solar System together."
      : `${planet.name} is the ${ordinal(planet.orderFromSun)} planet from the Sun.`;

  const expandedIntro =
    planet.longDesc ||
    `${planet.desc} This page shows its physical properties, motion, structure, exploration history, and important facts that make it unique in the Solar System.`;

  return (
    <div
      className={`planet-focus-overlay pf3-page ${
        closing ? "pf3-closing" : "pf3-opening"
      }`}
    >
      <div className="pf3-cinematic-bg" />

      <div className="pf3-frame">
        <header className="pf3-topbar pf3-anim-card" style={{ "--i": "0" }}>
          <button className="pf3-back" onClick={handleClose}>
            ← Back to Solar System
          </button>
        </header>

        <main className="pf3-shell">
          <section className="pf3-left">
            <PlanetViewer planet={planet} />

            <div className="pf3-hero-card pf3-anim-card" style={{ "--i": "1" }}>
              <div className="pf3-kicker">{positionText}</div>
              <h1>{planet.name}</h1>
              <p className="pf3-headline">{headline}</p>
              <p className="pf3-desc">{expandedIntro}</p>

              <div className="pf3-tags">
                <span>{planet.type}</span>
                <span>{positionText}</span>
                {planet.rings && <span>Ring System</span>}
              </div>
            </div>
          </section>

          <section className="pf3-right">
            <div className="pf3-panel pf3-anim-card" style={{ "--i": "2" }}>
              <div className="pf3-section-title">Quick Facts</div>

              <div className="pf3-chip-grid">
                <FactChip label="Gravity" value={planet.gravity} delay={1} />
                <FactChip label="Moons" value={planet.moons} delay={2} />
                <FactChip label="Diameter" value={planet.diameter} delay={3} />
                <FactChip
                  label="Temperature"
                  value={planet.temperature}
                  delay={4}
                />
                <FactChip
                  label="Distance"
                  value={planet.distanceFromSun}
                  delay={5}
                />
                <FactChip
                  label="Orbital Speed"
                  value={planet.orbitalSpeed}
                  delay={6}
                />
                <FactChip
                  label="Day Length"
                  value={planet.dayLength}
                  delay={7}
                />
                <FactChip
                  label="Year Length"
                  value={planet.yearLength}
                  delay={8}
                />
              </div>
            </div>

            <div className="pf3-info-grid">
              <div className="pf3-panel pf3-anim-card" style={{ "--i": "3" }}>
                <div className="pf3-section-title">Scientific Profile</div>

                <div className="pf3-row-list">
                  <InfoRow label="Type" value={planet.type} delay={1} />
                  <InfoRow label="Position" value={positionText} delay={2} />
                  <InfoRow label="Age" value={planet.age} delay={3} />
                  <InfoRow
                    label="Discovered"
                    value={planet.discoveredBy}
                    delay={4}
                  />
                  <InfoRow label="Mass" value={planet.mass} delay={5} />
                  <InfoRow
                    label="Escape Velocity"
                    value={planet.escapeVelocity}
                    delay={6}
                  />
                  <InfoRow
                    label="Axial Tilt"
                    value={planet.axialTilt}
                    delay={7}
                  />
                  <InfoRow
                    label="Magnetic Field"
                    value={planet.magneticField}
                    delay={8}
                  />
                  <InfoRow
                    label="Atmosphere"
                    value={planet.atmosphere}
                    delay={9}
                  />
                </div>
              </div>

              <div className="pf3-panel pf3-anim-card" style={{ "--i": "4" }}>
                <div className="pf3-section-title">Deep Details</div>

                <div className="pf3-row-list">
                  <InfoRow
                    label="Composition"
                    value={planet.composition}
                    delay={1}
                  />
                  <InfoRow label="Surface" value={planet.surface} delay={2} />
                  <InfoRow label="Rotation" value={planet.rotation} delay={3} />
                  <InfoRow
                    label="Main Moons"
                    value={planet.mainMoons}
                    delay={4}
                  />
                  <InfoRow
                    label="Known For"
                    value={planet.knownFor}
                    delay={5}
                  />
                  <InfoRow
                    label="Notable Feature"
                    value={planet.notableFeature}
                    delay={6}
                  />
                  <InfoRow
                    label="Exploration"
                    value={planet.exploration}
                    delay={7}
                  />
                  <InfoRow
                    label="Why Important"
                    value={planet.whyImportant}
                    delay={8}
                  />
                </div>
              </div>
            </div>

            <div className="pf3-story-grid">
              <div
                className="pf3-panel pf3-story pf3-nasa pf3-anim-card"
                style={{ "--i": "5" }}
              >
                <div className="pf3-section-title">NASA Fact</div>
                <p>{valueOrDash(planet.nasaFact)}</p>
              </div>

              <div
                className="pf3-panel pf3-story pf3-fun pf3-anim-card"
                style={{ "--i": "6" }}
              >
                <div className="pf3-section-title">Fun Fact</div>
                <p>{valueOrDash(planet.funFact)}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PlanetFocus;
