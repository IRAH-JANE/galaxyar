import React, { useEffect, useRef } from "react";

const SUN_BODY = {
  id: "sun",
  name: "Sun",
  size: 0.12,
  color: "#ffb347",
};

const PLANETS = [
  {
    id: "planet-Mercury",
    name: "Mercury",
    texture: "/textures/mercury.jpg",
    dist: 0.28,
    speed: 0.022,
    angle: 0,
    size: 0.026,
    color: "#b8b8b8",
    ellipse: 0.74,
    yAmp: 0.008,
    phase: 0.4,
    spin: 5200,
    moonFX: [],
  },
  {
    id: "planet-Venus",
    name: "Venus",
    texture: "/textures/venus.jpg",
    dist: 0.43,
    speed: 0.017,
    angle: 45,
    size: 0.035,
    color: "#e7b96f",
    ellipse: 0.76,
    yAmp: 0.011,
    phase: 1.1,
    spin: 7600,
    moonFX: [],
  },
  {
    id: "planet-Earth",
    name: "Earth",
    texture: "/textures/earth.jpg",
    dist: 0.58,
    speed: 0.013,
    angle: 90,
    size: 0.041,
    color: "#4f9fff",
    ellipse: 0.78,
    yAmp: 0.014,
    phase: 1.8,
    spin: 6400,
    moonFX: [
      {
        name: "Moon",
        orbit: 0.115,
        size: 0.014,
        color: "#e6e1d3",
        texture: "/textures/moon.jpg",
      },
    ],
  },
  {
    id: "planet-Mars",
    name: "Mars",
    texture: "/textures/mars.jpg",
    dist: 0.75,
    speed: 0.01,
    angle: 135,
    size: 0.034,
    color: "#ff6b3a",
    ellipse: 0.79,
    yAmp: 0.017,
    phase: 2.6,
    spin: 7000,
    moonFX: [
      { orbit: 0.06, size: 0.0048, color: "#c7b3a5" },
      { orbit: 0.083, size: 0.0038, color: "#9c8b80" },
    ],
  },
  {
    id: "planet-Jupiter",
    name: "Jupiter",
    texture: "/textures/jupiter.jpg",
    dist: 1.02,
    speed: 0.0065,
    angle: 180,
    size: 0.071,
    color: "#ffb56b",
    ellipse: 0.8,
    yAmp: 0.019,
    phase: 3.2,
    spin: 3800,
    moonFX: [
      { orbit: 0.105, size: 0.006, color: "#f1e2c6" },
      { orbit: 0.135, size: 0.0055, color: "#d8c19d" },
      { orbit: 0.166, size: 0.0065, color: "#b8c7d8" },
      { orbit: 0.198, size: 0.0055, color: "#d6b48a" },
    ],
  },
  {
    id: "planet-Saturn",
    name: "Saturn",
    texture: "/textures/saturn.jpg",
    dist: 1.27,
    speed: 0.0052,
    angle: 225,
    size: 0.061,
    color: "#f0d58b",
    ellipse: 0.79,
    yAmp: 0.021,
    phase: 4.1,
    spin: 4600,
    moonFX: [{ orbit: 0.13, size: 0.008, color: "#d8c090" }],
  },
  {
    id: "planet-Uranus",
    name: "Uranus",
    texture: "/textures/uranus.jpg",
    dist: 1.52,
    speed: 0.0042,
    angle: 270,
    size: 0.048,
    color: "#7df4ff",
    ellipse: 0.78,
    yAmp: 0.022,
    phase: 5.1,
    spin: 5600,
    moonFX: [],
  },
  {
    id: "planet-Neptune",
    name: "Neptune",
    texture: "/textures/neptune.jpg",
    dist: 1.78,
    speed: 0.0034,
    angle: 315,
    size: 0.046,
    color: "#5677ff",
    ellipse: 0.77,
    yAmp: 0.024,
    phase: 5.8,
    spin: 6000,
    moonFX: [],
  },
];

const CLICKABLE_BODIES = [SUN_BODY, ...PLANETS];
const TRAIL_COUNT = 5;

function seededRandom(seed = 42) {
  let value = seed >>> 0;

  return function rand() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967295;
  };
}

function solarRand(seed = 12345) {
  let value = seed >>> 0;

  return function rand() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967295;
  };
}

function makeEl(tag, attrs = {}, parent = null) {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  if (parent) parent.appendChild(el);
  return el;
}

/* ✅ PUT buildFreeSolarSystemGroup HERE */
function buildFreeSolarSystemGroup(parent) {
  const group = makeEl(
    "a-entity",
    {
      id: "solar-system-group-free",
      scale: "0.82 0.82 0.82",
    },
    parent,
  );

  makeEl(
    "a-sphere",
    {
      id: "sun-free",
      class: "clickable planet-sphere",
      "data-planet": "Sun",
      position: "0 0.12 0",
      radius: "0.12",
      material:
        "src: url(/textures/sun.jpg); color:#ffffff; emissive:#ff6600; emissiveIntensity:0.75; roughness:1; shader:standard;",
      animation:
        "property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 15000; easing: linear;",
    },
    group,
  );

  makeEl(
    "a-sphere",
    {
      class: "clickable",
      "data-planet": "Sun",
      position: "0 0.12 0",
      radius: "0.125",
      material: "opacity:0;transparent:true;",
    },
    group,
  );

  makeEl(
    "a-sphere",
    {
      position: "0 0.12 0",
      radius: "0.19",
      material:
        "color:#ff8800;opacity:0.12;transparent:true;shader:flat;side:back;",
    },
    group,
  );

  PLANETS.forEach((planet) => {
    const planetWrap = makeEl(
      "a-entity",
      {
        id: `${planet.id}-free`,
        class: "planet-orbit",
        "data-dist": planet.dist,
        "data-speed": planet.speed,
        "data-angle": planet.angle,
      },
      group,
    );

    makeEl(
      "a-sphere",
      {
        class: "clickable planet-sphere",
        "data-planet": planet.name,
        radius: planet.size,
        material: `src: url(${planet.texture}); color:#ffffff; roughness:0.9; metalness:0; shader:standard;`,
      },
      planetWrap,
    );

    if (planet.name === "Saturn" || planet.name === "Uranus") {
      makeEl(
        "a-torus",
        {
          radius: planet.name === "Saturn" ? "0.085" : "0.08",
          "radius-tubular": planet.name === "Saturn" ? "0.014" : "0.012",
          "segments-tubular": planet.name === "Saturn" ? "60" : "50",
          "segments-radial": planet.name === "Saturn" ? "6" : "5",
          rotation: "80 0 0",
          material:
            planet.name === "Saturn"
              ? "color:#c8b080;opacity:0.75;transparent:true;roughness:1;side:double;"
              : "color:#88cccc;opacity:0.45;transparent:true;side:double;",
        },
        planetWrap,
      );
    }

    makeEl(
      "a-sphere",
      {
        class: "clickable",
        "data-planet": planet.name,
        radius: planet.size * 2.2,
        material: "opacity:0;transparent:true;",
      },
      planetWrap,
    );
  });

  return group;
}

function dispatchPlanetInfo(name) {
  if (!name) return;

  window.dispatchEvent(
    new CustomEvent("planet-clicked", {
      detail: { name },
    }),
  );
}

function orbitPosition(p, angle) {
  const x = p.dist * Math.cos(angle);
  const z = p.dist * p.ellipse * Math.sin(angle);
  const y = 0.055 + p.yAmp * Math.sin(angle * 1.7 + p.phase);

  return { x, y, z };
}

function setEntityPosition(el, pos) {
  if (!el) return;

  el.setAttribute(
    "position",
    `${pos.x.toFixed(4)} ${pos.y.toFixed(4)} ${pos.z.toFixed(4)}`,
  );
}

function textureAssetId(name) {
  return `${name.toLowerCase()}Texture`;
}

function textureAssetSelector(name) {
  // Use a direct URL instead of an <a-assets> selector.
  // The free-solar view is a cloned A-Frame group, and cloned nodes can lose
  // the asset-linked texture binding, which makes planets render white.
  return `url(/textures/${name.toLowerCase()}.jpg)`;
}

function ARScene({ isPaused = false, mode = "hiro" }) {
  const engineRef = useRef(null);

  useEffect(() => {
    const starCanvas = document.getElementById("star-canvas");
    const galaxyCanvas = document.getElementById("galaxy-canvas");
    const hoverLabel = document.getElementById("planet-hover-label");
    const hoverNameEl = hoverLabel?.querySelector(".phl-name");
    const bottomLabel = document.getElementById("bottom-label");
    const planetFocusLabel = document.getElementById("planet-focus-label");
    const markerSolarGroup = document.getElementById("solar-system-group");
    const freeRoot = document.getElementById("free-space-root");

    if (
      !starCanvas ||
      !galaxyCanvas ||
      !hoverLabel ||
      !hoverNameEl ||
      !bottomLabel ||
      !planetFocusLabel ||
      !markerSolarGroup ||
      !freeRoot
    ) {
      return undefined;
    }

    const sctx = starCanvas.getContext("2d");
    const gctx = galaxyCanvas.getContext("2d");

    let paused = Boolean(isPaused);
    window.__GALAXY_AR_PAUSED__ = paused;
    let engineDestroyed = false;
    let markerFound = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let uiMode = "solar";
    let manualMode = null;
    let zoomLevel = 1;
    let zoomTarget = 1;
    let zoomVelocity = 0;
    let galaxyOpacity = 0;
    let starOpacity = 0;
    let hoveredPlanet = null;
    let isPlanetFocusActive = false;
    let prevZoom = 1;
    let starExpansion = 0;
    let galaxyRot = 0;
    let galaxyIntro = 0;
    let galaxyWarp = 0;
    let rafOrbit = null;
    let rafRender = null;
    let freeSolarGroup = null;

    const galaxyMouse = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
    };

    const galaxyField = {
      bgStars: [],
      armStars: [],
      dust: [],
      clusters: [],
    };

    window.__PLANET_MODAL_OPEN__ = false;

    freeRoot.innerHTML = "";
    freeSolarGroup = buildFreeSolarSystemGroup(freeRoot);

    function getSolarRoots() {
      return [
        { root: markerSolarGroup, suffix: "" },
        { root: freeSolarGroup, suffix: "-free" },
      ].filter((item) => item.root);
    }

    function hidePlanetLabels() {
      hoveredPlanet = null;
      hoverNameEl.textContent = "";
      hoverLabel.style.opacity = "0";
      bottomLabel.style.opacity = "0";
      planetFocusLabel.style.opacity = "0";
    }

    function emitGalaxyMode() {
      window.dispatchEvent(
        new CustomEvent("galaxy-mode-changed", {
          detail: { mode: manualMode || "hiro" },
        }),
      );
    }

    function spaceActive() {
      return markerFound || manualMode !== null;
    }

    function isSolarInteractionActive() {
      return (
        !window.__PLANET_MODAL_OPEN__ &&
        uiMode === "solar" &&
        manualMode !== "galaxy" &&
        (markerFound || manualMode === "solar")
      );
    }

    function usingFreeRoot() {
      return !markerFound && manualMode === "solar";
    }

    function getBodyElement(body) {
      const id = usingFreeRoot() ? `${body.id}-free` : body.id;
      return document.getElementById(id);
    }

    function getActiveSolarGroup() {
      return usingFreeRoot() ? freeSolarGroup : markerSolarGroup;
    }

    function setPlanetModalState(open) {
      window.__PLANET_MODAL_OPEN__ = open;

      if (open) {
        document.body.classList.add("modal-open");
        hidePlanetLabels();
      } else {
        document.body.classList.remove("modal-open");
      }
    }

    function setManualMode(nextMode) {
      manualMode = nextMode;
      hidePlanetLabels();
      emitGalaxyMode();
    }

    function setSolarAnimationsPaused(value) {
      const shouldPause = Boolean(value);

      getSolarRoots().forEach(({ root }) => {
        if (!root) return;

        if (shouldPause) {
          root.pause?.();
        } else {
          root.play?.();
        }
      });
    }

    window.__galaxyAR = {
      setPaused: (value) => {
        paused = Boolean(value);
        window.__GALAXY_AR_PAUSED__ = paused;
        setSolarAnimationsPaused(paused);
      },

      showGalaxy: () => {
        setManualMode("galaxy");
        hoveredPlanet = null;
        zoomTarget = 0.2;
        zoomLevel = 0.28;
        galaxyOpacity = Math.max(galaxyOpacity, 0.04);
        starOpacity = Math.max(starOpacity, 0.35);
        galaxyIntro = 0;
        galaxyWarp = 1;
        setPlanetModalState(false);
      },

      showSolar: () => {
        setManualMode("solar");
        zoomTarget = 1.15;
        zoomLevel = 1.05;
        galaxyOpacity = 0;
        starOpacity = Math.max(starOpacity, 0.88);

        if (markerSolarGroup) {
          markerSolarGroup.setAttribute(
            "visible",
            markerFound ? "true" : "false",
          );
        }

        if (freeRoot) {
          freeRoot.setAttribute("visible", !markerFound ? "true" : "false");
        }

        forceSolarTextures();
        setTimeout(forceSolarTextures, 100);
        setPlanetModalState(false);
      },

      useHiro: () => {
        setManualMode(null);
        zoomTarget = 1;
        setPlanetModalState(false);
      },

      setModalOpen: (open) => {
        setPlanetModalState(Boolean(open));
      },
    };

    function createOrbitRoads(root, suffix) {
      PLANETS.forEach((p, index) => {
        if (document.getElementById(`orbit-road-${p.name}${suffix}`)) return;

        const roadGroup = makeEl(
          "a-entity",
          {
            id: `orbit-road-group-${p.name}${suffix}`,
            position: "0 0.032 0",
          },
          root,
        );

        const roadOpacity = index < 4 ? 0.34 : 0.25;
        const glowOpacity = index < 4 ? 0.075 : 0.055;
        const tube = index < 4 ? 0.0025 : 0.0032;

        makeEl(
          "a-torus",
          {
            id: `orbit-road-${p.name}${suffix}`,
            radius: String(p.dist),
            "radius-tubular": String(tube),
            "segments-tubular": "192",
            "segments-radial": "8",
            rotation: "-90 0 0",
            scale: `1 ${p.ellipse} 1`,
            material: `color:${p.color};opacity:${roadOpacity};transparent:true;shader:flat;`,
            animation__breathe: `property: material.opacity; from:${roadOpacity}; to:${Math.min(
              roadOpacity + 0.08,
              0.48,
            )}; dir: alternate; dur:${2600 + index * 280}; loop:true; easing:easeInOutSine;`,
          },
          roadGroup,
        );

        makeEl(
          "a-torus",
          {
            id: `orbit-road-glow-${p.name}${suffix}`,
            radius: String(p.dist),
            "radius-tubular": String(tube * 3.6),
            "segments-tubular": "192",
            "segments-radial": "8",
            rotation: "-90 0 0",
            scale: `1 ${p.ellipse} 1`,
            material: `color:${p.color};opacity:${glowOpacity};transparent:true;shader:flat;`,
          },
          roadGroup,
        );
      });
    }

    function toneDownOldOrbitRings(root) {
      Array.from(root.children).forEach((child) => {
        if (child.tagName?.toLowerCase() !== "a-torus") return;
        child.setAttribute("visible", "false");
      });
    }

    function enhanceSun(root, suffix) {
      const sunEl = document.getElementById(`sun${suffix}`);

      if (sunEl) {
        sunEl.setAttribute("position", "0 0.12 0");
        sunEl.setAttribute("scale", "1 1 1");
        sunEl.setAttribute(
          "material",
          "src: url(/textures/sun.jpg); color:#ffffff; emissive: #ff6600; emissiveIntensity: 1.2; roughness: 1;",
        );
      }

      if (document.getElementById(`sun-corona${suffix}`)) return;

      makeEl(
        "a-sphere",
        {
          id: `sun-corona${suffix}`,
          position: "0 0.12 0",
          radius: "0.24",
          material:
            "color:#ff8c2a;opacity:0.16;transparent:true;shader:flat;side:back;",
          animation__pulse:
            "property: scale; dir: alternate; dur: 1800; loop: true; easing: easeInOutSine; to: 1.18 1.18 1.18;",
        },
        root,
      );

      makeEl(
        "a-sphere",
        {
          id: `sun-outer-glow${suffix}`,
          position: "0 0.12 0",
          radius: "0.37",
          material:
            "color:#ffcc55;opacity:0.055;transparent:true;shader:flat;side:back;",
          animation__pulse:
            "property: scale; dir: alternate; dur: 2600; loop: true; easing: easeInOutSine; to: 1.28 1.28 1.28;",
        },
        root,
      );

      [
        { id: "a", radius: 0.25, rot: "90 0 0", dur: 19000 },
        { id: "b", radius: 0.31, rot: "70 30 0", dur: 24000 },
        { id: "c", radius: 0.38, rot: "110 -25 0", dur: 31000 },
      ].forEach((flare) => {
        makeEl(
          "a-torus",
          {
            id: `sun-flare-${flare.id}${suffix}`,
            position: "0 0.12 0",
            radius: String(flare.radius),
            "radius-tubular": "0.0025",
            rotation: flare.rot,
            material:
              "color:#ffd27a;opacity:0.28;transparent:true;shader:flat;",
            animation__spin: `property: rotation; to: ${flare.rot.split(" ")[0]
              } 360 0; dur:${flare.dur}; loop:true; easing:linear;`,
          },
          root,
        );
      });
    }

    function createOrbitParticles(root, suffix) {
      PLANETS.forEach((p) => {
        if (document.getElementById(`orbit-spark-${p.name}-0${suffix}`)) return;

        const count = 28;

        for (let i = 0; i < count; i += 1) {
          const a = (i / count) * Math.PI * 2;
          const pos = orbitPosition(p, a);
          const alpha = 0.035 + 0.075 * Math.max(0, Math.sin(a + p.phase));
          const radius = i % 7 === 0 ? 0.0045 : 0.0026;

          makeEl(
            "a-sphere",
            {
              id: `orbit-spark-${p.name}-${i}${suffix}`,
              position: `${pos.x.toFixed(4)} ${(pos.y - 0.018).toFixed(
                4,
              )} ${pos.z.toFixed(4)}`,
              radius: String(radius),
              material: `color:${p.color};opacity:${alpha.toFixed(
                3,
              )};transparent:true;shader:flat;`,
            },
            root,
          );
        }
      });
    }

    function createAsteroidBelt(root, suffix) {
      if (document.getElementById(`asteroid-belt${suffix}`)) return;

      const rand = solarRand(suffix ? 8831 : 4417);

      const belt = makeEl(
        "a-entity",
        {
          id: `asteroid-belt${suffix}`,
          animation__rotate:
            "property: rotation; to: 0 360 0; dur: 120000; loop: true; easing: linear;",
        },
        root,
      );

      for (let i = 0; i < 72; i += 1) {
        const a = rand() * Math.PI * 2;
        const r = 0.86 + rand() * 0.075;
        const ellipse = 0.8 + rand() * 0.07;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r * ellipse;
        const y = 0.045 + (rand() - 0.5) * 0.035;
        const size = 0.0035 + rand() * 0.008;

        makeEl(
          "a-sphere",
          {
            position: `${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}`,
            radius: size.toFixed(4),
            material:
              "color:#9b8c7a;opacity:0.68;transparent:true;roughness:1;shader:flat;",
          },
          belt,
        );
      }
    }

    function createPlanetFX(root, suffix) {
      PLANETS.forEach((p) => {
        const planetEl = root.querySelector(`#${p.id}${suffix}`);

        if (!planetEl) return;

        const sphere = planetEl.querySelector(".planet-sphere");

        if (sphere) {
          // IMPORTANT:
          // Free solar view is cloned, so #texture asset IDs can break.
          // Direct URL keeps the real texture working in both HIRO and free view.
          sphere.setAttribute(
            "material",
            [
              `src: url(${p.texture})`,
              "color: #ffffff",
              "roughness: 0.9",
              "metalness: 0",
              "shader: standard",
            ].join("; "),
          );

          sphere.setAttribute(
            "animation__spin",
            `property: rotation; from:0 0 0; to:0 360 0; dur:${p.spin}; loop:true; easing:linear;`,
          );
        }

        if (!document.getElementById(`planet-glow-${p.name}${suffix}`)) {
          makeEl(
            "a-sphere",
            {
              id: `planet-glow-${p.name}${suffix}`,
              radius: (p.size * 1.85).toFixed(4),
              material: `color:${p.color};opacity:0.13;transparent:true;shader:flat;side:back;`,
            },
            planetEl,
          );
        }

        if (!document.getElementById(`planet-atmo-${p.name}${suffix}`)) {
          makeEl(
            "a-sphere",
            {
              id: `planet-atmo-${p.name}${suffix}`,
              radius: (p.size * 1.28).toFixed(4),
              material: `color:${p.color};opacity:0.09;transparent:true;shader:flat;side:back;`,
            },
            planetEl,
          );
        }

        if (
          p.moonFX?.length &&
          !document.getElementById(`moon-wrap-${p.name}${suffix}`)
        ) {
          const moonWrap = makeEl(
            "a-entity",
            {
              id: `moon-wrap-${p.name}${suffix}`,
            },
            planetEl,
          );

          p.moonFX.forEach((moon, index) => {
            const a = (index / p.moonFX.length) * Math.PI * 2;
            const x = Math.cos(a) * moon.orbit;
            const z = Math.sin(a) * moon.orbit;

            makeEl(
              "a-torus",
              {
                radius: String(moon.orbit),
                "radius-tubular": "0.0012",
                rotation: "90 0 0",
                material:
                  "color:#ffffff;opacity:0.14;transparent:true;shader:flat;",
              },
              moonWrap,
            );

            makeEl(
              "a-sphere",
              {
                id: `moon-${p.name}-${index}${suffix}`,
                position: `${x.toFixed(4)} 0 ${z.toFixed(4)}`,
                radius: String(moon.size),
                material: moon.texture
                  ? `src: url(${moon.texture}); color:#ffffff; roughness:1; metalness:0; shader:standard;`
                  : `color:${moon.color};opacity:0.95;roughness:1;shader:flat;`,
              },
              moonWrap,
            );

            makeEl(
              "a-sphere",
              {
                id: `moon-glow-${p.name}-${index}${suffix}`,
                position: `${x.toFixed(4)} 0 ${z.toFixed(4)}`,
                radius: String(moon.size * 1.9),
                material: `color:${moon.color};opacity:0.12;transparent:true;shader:flat;side:back;`,
              },
              moonWrap,
            );
          });
        }

        for (let i = 0; i < TRAIL_COUNT; i += 1) {
          if (document.getElementById(`trail-${p.name}-${i}${suffix}`))
            continue;

          makeEl(
            "a-sphere",
            {
              id: `trail-${p.name}-${i}${suffix}`,
              radius: (p.size * (0.42 - i * 0.03)).toFixed(4),
              material: `color:${p.color};opacity:${(0.22 - i * 0.023).toFixed(
                3,
              )};transparent:true;shader:flat;`,
            },
            root,
          );
        }
      });
    }

    function createComet(root, suffix) {
      if (document.getElementById(`comet-head${suffix}`)) return;

      makeEl(
        "a-sphere",
        {
          id: `comet-head${suffix}`,
          radius: "0.018",
          material: "color:#ffffff;opacity:1;transparent:true;shader:flat;",
        },
        root,
      );

      for (let i = 0; i < 9; i += 1) {
        makeEl(
          "a-sphere",
          {
            id: `comet-tail-${i}${suffix}`,
            radius: String(0.015 - i * 0.0012),
            material: `color:#9fd5ff;opacity:${(0.32 - i * 0.028).toFixed(
              3,
            )};transparent:true;shader:flat;`,
          },
          root,
        );
      }
    }

    function updateComet(suffix, time) {
      const head = document.getElementById(`comet-head${suffix}`);
      if (!head) return;

      const base = time * 0.00026 + (suffix ? 1.4 : 0);
      const cometA = 1.28;
      const cometB = 0.56;

      for (let i = 0; i < 10; i += 1) {
        const a = base - i * 0.045;
        const x = Math.cos(a) * cometA;
        const z = Math.sin(a) * cometB;
        const y = 0.16 + Math.sin(a * 2.3) * 0.12;

        const el =
          i === 0
            ? head
            : document.getElementById(`comet-tail-${i - 1}${suffix}`);

        if (!el) continue;

        el.setAttribute(
          "position",
          `${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}`,
        );
      }
    }

    function forceSolarTextures() {
      getSolarRoots().forEach(({ root, suffix }) => {
        const sunEl = root?.querySelector(`#sun${suffix}`);
        if (sunEl) {
          sunEl.setAttribute(
            "material",
            "src: url(/textures/sun.jpg); color:#ffffff; emissive:#ff6600; emissiveIntensity:0.75; roughness:1; shader:standard;",
          );
        }

        PLANETS.forEach((p) => {
          const sphere = root?.querySelector(
            `#${p.id}${suffix} .planet-sphere`,
          );
          if (!sphere) return;

          sphere.setAttribute(
            "material",
            `src: url(${p.texture}); color:#ffffff; roughness:0.9; metalness:0;`,
          );
        });
      });
    }

    function enhanceSolarSystem() {
      getSolarRoots().forEach(({ root, suffix }) => {
        if (!root || root.dataset.solarEnhanced === "true") return;

        root.dataset.solarEnhanced = "true";

        toneDownOldOrbitRings(root);
        createOrbitRoads(root, suffix);
        enhanceSun(root, suffix);
        createOrbitParticles(root, suffix);
        createAsteroidBelt(root, suffix);
        createPlanetFX(root, suffix);
        createComet(root, suffix);
      });
    }

    const allStars = [];

    [
      {
        count: 900,
        rMin: 0.3,
        rMax: 0.85,
        aMin: 0.18,
        aMax: 0.48,
        depth: 0.12,
      },
      {
        count: 500,
        rMin: 0.7,
        rMax: 1.35,
        aMin: 0.28,
        aMax: 0.62,
        depth: 0.32,
      },
      {
        count: 200,
        rMin: 1.1,
        rMax: 2.0,
        aMin: 0.48,
        aMax: 0.88,
        depth: 0.62,
      },
    ].forEach((layer) => {
      for (let i = 0; i < layer.count; i += 1) {
        const rnd = Math.random();

        allStars.push({
          angle: Math.random() * Math.PI * 2,
          df: Math.random(),
          r: layer.rMin + Math.random() * (layer.rMax - layer.rMin),
          a: layer.aMin + Math.random() * (layer.aMax - layer.aMin),
          phase: Math.random() * Math.PI * 2,
          depth: layer.depth,
          hue: rnd < 0.07 ? 215 : rnd < 0.12 ? 12 : 0,
          sat: rnd < 0.07 ? 75 : rnd < 0.12 ? 80 : 0,
        });
      }
    });

    function buildGalaxyField() {
      const rand = seededRandom(98765);

      galaxyField.bgStars = [];
      galaxyField.armStars = [];
      galaxyField.dust = [];
      galaxyField.clusters = [];

      for (let i = 0; i < 1200; i += 1) {
        galaxyField.bgStars.push({
          x: rand(),
          y: rand(),
          r: 0.25 + rand() * 1.4,
          a: 0.08 + rand() * 0.55,
          phase: rand() * Math.PI * 2,
          depth: 0.15 + rand() * 0.85,
          warm: rand() > 0.82,
        });
      }

      const armCount = 4;

      for (let arm = 0; arm < armCount; arm += 1) {
        const base = arm * ((Math.PI * 2) / armCount) + 0.25;

        for (let i = 0; i < 1700; i += 1) {
          const t = i / 1700;
          const spiral = base + t * Math.PI * 3.6;
          const radius = 0.045 + t * 0.94;
          const width = 0.018 + t * 0.065;
          const sideScatter = (rand() - 0.5) * width;
          const alongScatter = (rand() - 0.5) * 0.085;
          const angle = spiral + alongScatter;
          const r = Math.max(0, radius + sideScatter);
          const isBlue = arm % 2 === 0;
          const isHot = rand() > 0.94;

          galaxyField.armStars.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
            size: 0.18 + rand() * (isHot ? 2.4 : 1.25),
            alpha: (0.15 + rand() * 0.75) * (1 - t * 0.25),
            blue: isBlue,
            hot: isHot,
            phase: rand() * Math.PI * 2,
            twinkle: 0.6 + rand() * 1.8,
          });
        }
      }

      for (let lane = 0; lane < 5; lane += 1) {
        const base = lane * ((Math.PI * 2) / 5) + 0.6;

        for (let i = 0; i < 480; i += 1) {
          const t = i / 480;
          const spiral = base + t * Math.PI * 3.15;
          const radius = 0.09 + t * 0.82;
          const spread = 0.025 + t * 0.05;
          const angle = spiral + (rand() - 0.5) * 0.16;
          const r = radius + (rand() - 0.5) * spread;

          galaxyField.dust.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
            rx: 0.008 + rand() * 0.032 + t * 0.02,
            ry: 0.004 + rand() * 0.014,
            a: 0.08 + rand() * 0.25,
            rot: rand() * Math.PI,
          });
        }
      }

      for (let i = 0; i < 120; i += 1) {
        const arm = Math.floor(rand() * 4);
        const base = arm * ((Math.PI * 2) / 4) + 0.25;
        const t = 0.12 + rand() * 0.82;
        const angle = base + t * Math.PI * 3.5 + (rand() - 0.5) * 0.22;
        const radius = 0.08 + t * 0.86;

        galaxyField.clusters.push({
          x: Math.cos(angle) * radius + (rand() - 0.5) * 0.06,
          y: Math.sin(angle) * radius + (rand() - 0.5) * 0.06,
          r: 0.012 + rand() * 0.038,
          a: 0.08 + rand() * 0.22,
          pink: rand() > 0.45,
        });
      }
    }

    function resizeCanvases() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      starCanvas.width = Math.floor(window.innerWidth * dpr);
      starCanvas.height = Math.floor(window.innerHeight * dpr);
      galaxyCanvas.width = Math.floor(window.innerWidth * dpr);
      galaxyCanvas.height = Math.floor(window.innerHeight * dpr);

      starCanvas.style.width = "100vw";
      starCanvas.style.height = "100vh";
      galaxyCanvas.style.width = "100vw";
      galaxyCanvas.style.height = "100vh";

      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildGalaxyField();
    }

    function drawStars(opacity) {
      const W = starCanvas.width;
      const H = starCanvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy);
      const now = performance.now() / 1000;

      sctx.clearRect(0, 0, W, H);

      if (opacity < 0.005) return;

      const zDelta = zoomLevel - prevZoom;
      starExpansion += zDelta * 3.2;
      starExpansion *= 0.8;
      prevZoom = zoomLevel;

      allStars.forEach((s) => {
        const baseDist = s.df * maxR * 1.12;
        const radialShift = starExpansion * s.depth * maxR * 0.13;
        const dist = Math.max(0, baseDist + radialShift);
        const wrapped = dist % (maxR * 1.12);
        const x = cx + Math.cos(s.angle) * wrapped;
        const y = cy + Math.sin(s.angle) * wrapped * 0.85;
        const warp = Math.abs(starExpansion) * s.depth;
        const twinkle = s.a + Math.sin(now * 1.1 + s.phase) * 0.1;
        const alpha = Math.max(0, Math.min(1, twinkle)) * opacity;

        const color = s.hue
          ? `hsla(${s.hue},${s.sat}%,90%,${alpha.toFixed(3)})`
          : `rgba(255,255,255,${alpha.toFixed(3)})`;

        if (warp > 0.35) {
          const sx =
            cx + Math.cos(s.angle) * Math.max(0, wrapped - warp * 9 * s.depth);
          const sy =
            cy +
            Math.sin(s.angle) *
            Math.max(0, wrapped - warp * 9 * s.depth) *
            0.85;

          sctx.beginPath();
          sctx.moveTo(sx, sy);
          sctx.lineTo(x, y);
          sctx.strokeStyle = color;
          sctx.lineWidth = s.r * (0.38 + warp * 0.28);
          sctx.stroke();
        } else {
          sctx.beginPath();
          sctx.arc(x, y, s.r, 0, Math.PI * 2);
          sctx.fillStyle = color;
          sctx.fill();
        }
      });
    }

    function drawGalaxy(opacity) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.58;
      const now = performance.now() * 0.001;

      gctx.clearRect(0, 0, W, H);

      if (opacity < 0.005) return;

      galaxyIntro += (opacity - galaxyIntro) * 0.035;
      galaxyWarp *= 0.92;

      galaxyMouse.x += (galaxyMouse.tx - galaxyMouse.x) * 0.035;
      galaxyMouse.y += (galaxyMouse.ty - galaxyMouse.y) * 0.035;

      const driftX = galaxyMouse.x * 34;
      const driftY = galaxyMouse.y * 24;
      const cinematicScale =
        0.86 +
        galaxyIntro * 0.18 +
        Math.sin(now * 0.22) * 0.012 +
        galaxyWarp * 0.035;

      const tilt = 0.48 + Math.sin(now * 0.13) * 0.018;
      const rotation = galaxyRot + galaxyMouse.x * 0.045;

      gctx.save();
      gctx.globalAlpha = opacity;
      gctx.fillStyle = "#000";
      gctx.fillRect(0, 0, W, H);
      gctx.restore();

      gctx.save();
      gctx.globalAlpha = opacity;

      galaxyField.bgStars.forEach((star) => {
        const px = star.x * W + driftX * star.depth;
        const py = star.y * H + driftY * star.depth;
        const twinkle = 0.72 + Math.sin(now * 1.6 + star.phase) * 0.28;
        const alpha = star.a * twinkle * opacity;

        gctx.beginPath();
        gctx.arc(px, py, star.r, 0, Math.PI * 2);
        gctx.fillStyle = star.warm
          ? `rgba(255,205,150,${alpha.toFixed(3)})`
          : `rgba(220,235,255,${alpha.toFixed(3)})`;
        gctx.fill();
      });

      gctx.restore();

      gctx.save();
      gctx.globalAlpha = opacity;
      gctx.translate(cx + driftX, cy + driftY);
      gctx.rotate(rotation);
      gctx.scale(cinematicScale, cinematicScale * tilt);

      const outerHalo = gctx.createRadialGradient(
        0,
        0,
        R * 0.08,
        0,
        0,
        R * 1.16,
      );
      outerHalo.addColorStop(0, "rgba(255,245,210,0.78)");
      outerHalo.addColorStop(0.12, "rgba(255,194,105,0.42)");
      outerHalo.addColorStop(0.3, "rgba(96,122,220,0.24)");
      outerHalo.addColorStop(0.55, "rgba(44,95,190,0.13)");
      outerHalo.addColorStop(0.82, "rgba(15,35,90,0.05)");
      outerHalo.addColorStop(1, "rgba(0,0,0,0)");

      gctx.fillStyle = outerHalo;
      gctx.beginPath();
      gctx.arc(0, 0, R * 1.16, 0, Math.PI * 2);
      gctx.fill();

      const diskGlow = gctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R * 0.95);
      diskGlow.addColorStop(0, "rgba(255,230,170,0.4)");
      diskGlow.addColorStop(0.25, "rgba(140,120,210,0.18)");
      diskGlow.addColorStop(0.58, "rgba(65,120,220,0.1)");
      diskGlow.addColorStop(1, "rgba(0,0,0,0)");

      gctx.fillStyle = diskGlow;
      gctx.beginPath();
      gctx.arc(0, 0, R * 0.95, 0, Math.PI * 2);
      gctx.fill();

      gctx.save();
      gctx.rotate(0.18);
      const bar = gctx.createLinearGradient(-R * 0.28, 0, R * 0.28, 0);
      bar.addColorStop(0, "rgba(255,220,150,0)");
      bar.addColorStop(0.25, "rgba(255,210,125,0.38)");
      bar.addColorStop(0.5, "rgba(255,248,205,0.82)");
      bar.addColorStop(0.75, "rgba(255,210,125,0.38)");
      bar.addColorStop(1, "rgba(255,220,150,0)");
      gctx.fillStyle = bar;
      gctx.beginPath();
      gctx.ellipse(0, 0, R * 0.31, R * 0.055, 0, 0, Math.PI * 2);
      gctx.fill();
      gctx.restore();

      galaxyField.armStars.forEach((star) => {
        const x = star.x * R;
        const y = star.y * R;
        const twinkle = 0.78 + Math.sin(now * star.twinkle + star.phase) * 0.22;
        const alpha = star.alpha * twinkle * opacity;
        const size = star.size * (star.hot ? 1.15 : 1);

        if (galaxyWarp > 0.04) {
          gctx.beginPath();
          gctx.moveTo(x * (1 - galaxyWarp * 0.06), y * (1 - galaxyWarp * 0.06));
          gctx.lineTo(
            x * (1 + galaxyWarp * 0.035),
            y * (1 + galaxyWarp * 0.035),
          );
          gctx.strokeStyle = star.blue
            ? `rgba(160,195,255,${(alpha * 0.55).toFixed(3)})`
            : `rgba(255,215,170,${(alpha * 0.5).toFixed(3)})`;
          gctx.lineWidth = Math.max(0.4, size * 0.75);
          gctx.stroke();
        }

        gctx.beginPath();
        gctx.arc(x, y, size, 0, Math.PI * 2);
        gctx.fillStyle = star.hot
          ? `rgba(255,245,210,${Math.min(1, alpha * 1.25).toFixed(3)})`
          : star.blue
            ? `rgba(155,190,255,${alpha.toFixed(3)})`
            : `rgba(255,205,150,${alpha.toFixed(3)})`;
        gctx.fill();
      });

      galaxyField.clusters.forEach((cluster) => {
        const x = cluster.x * R;
        const y = cluster.y * R;
        const radius = cluster.r * R;
        const nebula = gctx.createRadialGradient(x, y, 0, x, y, radius);

        if (cluster.pink) {
          nebula.addColorStop(
            0,
            `rgba(255,90,170,${(cluster.a * opacity).toFixed(3)})`,
          );
          nebula.addColorStop(
            0.45,
            `rgba(170,70,160,${(cluster.a * 0.35 * opacity).toFixed(3)})`,
          );
          nebula.addColorStop(1, "rgba(0,0,0,0)");
        } else {
          nebula.addColorStop(
            0,
            `rgba(120,180,255,${(cluster.a * opacity).toFixed(3)})`,
          );
          nebula.addColorStop(
            0.55,
            `rgba(60,110,230,${(cluster.a * 0.35 * opacity).toFixed(3)})`,
          );
          nebula.addColorStop(1, "rgba(0,0,0,0)");
        }

        gctx.fillStyle = nebula;
        gctx.beginPath();
        gctx.arc(x, y, radius, 0, Math.PI * 2);
        gctx.fill();
      });

      galaxyField.dust.forEach((dust) => {
        const x = dust.x * R;
        const y = dust.y * R;

        gctx.save();
        gctx.translate(x, y);
        gctx.rotate(dust.rot);
        gctx.scale(dust.rx * R, dust.ry * R);
        gctx.beginPath();
        gctx.arc(0, 0, 1, 0, Math.PI * 2);
        gctx.fillStyle = `rgba(0,0,0,${(dust.a * opacity).toFixed(3)})`;
        gctx.fill();
        gctx.restore();
      });

      const core = gctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.24);
      core.addColorStop(0, "rgba(255,255,245,1)");
      core.addColorStop(0.08, "rgba(255,237,175,0.95)");
      core.addColorStop(0.25, "rgba(255,190,95,0.82)");
      core.addColorStop(0.5, "rgba(180,105,60,0.38)");
      core.addColorStop(0.78, "rgba(80,55,35,0.12)");
      core.addColorStop(1, "rgba(0,0,0,0)");

      gctx.fillStyle = core;
      gctx.beginPath();
      gctx.arc(0, 0, R * 0.24, 0, Math.PI * 2);
      gctx.fill();

      const pin = gctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.045);
      pin.addColorStop(0, "rgba(255,255,255,1)");
      pin.addColorStop(0.5, "rgba(255,245,190,0.75)");
      pin.addColorStop(1, "rgba(255,220,120,0)");

      gctx.fillStyle = pin;
      gctx.beginPath();
      gctx.arc(0, 0, R * 0.045, 0, Math.PI * 2);
      gctx.fill();

      gctx.restore();

      gctx.save();
      gctx.globalAlpha = opacity;
      const vignette = gctx.createRadialGradient(
        cx,
        cy,
        Math.min(W, H) * 0.2,
        cx,
        cy,
        Math.max(W, H) * 0.68,
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.7, "rgba(0,0,0,0.16)");
      vignette.addColorStop(1, "rgba(0,0,0,0.84)");
      gctx.fillStyle = vignette;
      gctx.fillRect(0, 0, W, H);
      gctx.restore();
    }

    let lastOrbitTime = performance.now();
    let frozenOrbitTime = lastOrbitTime;

    function animateOrbits() {
      if (engineDestroyed) return;

      const now = performance.now();
      const effectivePaused = Boolean(paused || window.__GALAXY_AR_PAUSED__);
      const time = effectivePaused ? frozenOrbitTime : now;

      if (!effectivePaused) {
        lastOrbitTime = now;
        frozenOrbitTime = now;
      }

      PLANETS.forEach((p) => {
        if (!effectivePaused) p.angle += p.speed;

        getSolarRoots().forEach(({ suffix }) => {
          const planetEl = document.getElementById(`${p.id}${suffix}`);

          if (!planetEl) return;

          const pos = orbitPosition(p, p.angle);
          setEntityPosition(planetEl, pos);

          const isHovered =
            hoveredPlanet === p.name &&
            uiMode === "solar" &&
            !window.__PLANET_MODAL_OPEN__;

          const hoverScale = isHovered ? 1.12 : 1;

          planetEl.setAttribute(
            "scale",
            `${hoverScale.toFixed(3)} ${hoverScale.toFixed(3)} ${hoverScale.toFixed(3)}`,
          );

          const glow = document.getElementById(
            `planet-glow-${p.name}${suffix}`,
          );

          if (glow) {
            const pulse =
              0.11 +
              Math.sin(time * 0.0022 + p.phase) * 0.028 +
              (isHovered ? 0.12 : 0);

            glow.setAttribute(
              "material",
              `color:${p.color};opacity:${Math.max(0.06, pulse).toFixed(
                3,
              )};transparent:true;shader:flat;side:back;`,
            );
          }

          const atmo = document.getElementById(
            `planet-atmo-${p.name}${suffix}`,
          );

          if (atmo) {
            const pulse = isHovered ? 0.16 : 0.08;

            atmo.setAttribute(
              "material",
              `color:${p.color};opacity:${pulse};transparent:true;shader:flat;side:back;`,
            );
          }

          const moonWrap = document.getElementById(
            `moon-wrap-${p.name}${suffix}`,
          );

          if (moonWrap && !paused) {
            const moonSpeed = p.name === "Earth" ? 0.032 : 0.018 + p.speed * 9;

            moonWrap.setAttribute(
              "rotation",
              `0 ${(time * moonSpeed).toFixed(2)} 0`,
            );
          }

          for (let i = 0; i < TRAIL_COUNT; i += 1) {
            const trail = document.getElementById(
              `trail-${p.name}-${i}${suffix}`,
            );

            if (!trail) continue;

            const trailAngle = p.angle - i * (0.042 + p.speed * 1.3);
            const trailPos = orbitPosition(p, trailAngle);
            const fade = Math.max(0, 0.23 - i * 0.027);

            trail.setAttribute(
              "position",
              `${trailPos.x.toFixed(4)} ${trailPos.y.toFixed(4)} ${trailPos.z.toFixed(4)}`,
            );

            trail.setAttribute(
              "material",
              `color:${p.color};opacity:${fade.toFixed(3)};transparent:true;shader:flat;`,
            );
          }
        });
      });

      if (!paused) {
        updateComet("", time);
        updateComet("-free", time);
      }

      rafOrbit = requestAnimationFrame(animateOrbits);
    }

    function getHoveredPlanet(cx, cy, scene, hitMode = "hover") {
      const camera = scene?.camera;

      if (!camera || !scene.canvas) return null;
      if (!isSolarInteractionActive()) return null;
      if (!window.THREE) return null;

      const rect = scene.canvas.getBoundingClientRect();
      const isClick = hitMode === "click";

      function projectToScreen(worldVector) {
        const projected = worldVector.clone().project(camera);

        return {
          x: rect.left + (projected.x * 0.5 + 0.5) * rect.width,
          y: rect.top + (1 - (projected.y * 0.5 + 0.5)) * rect.height,
          z: projected.z,
        };
      }

      let best = null;
      let bestD = Infinity;

      CLICKABLE_BODIES.forEach((body) => {
        const el = getBodyElement(body);

        if (!el?.object3D) return;

        el.object3D.updateMatrixWorld(true);

        const worldPos = new window.THREE.Vector3();
        el.object3D.getWorldPosition(worldPos);

        const center = projectToScreen(worldPos);

        if (center.z > 1 || center.z < -1) return;

        const worldScale = new window.THREE.Vector3();
        el.object3D.getWorldScale(worldScale);

        const bodyWorldRadius =
          (body.size || 0.04) *
          Math.max(worldScale.x || 1, worldScale.y || 1, worldScale.z || 1);

        const cameraRight = new window.THREE.Vector3(1, 0, 0)
          .applyQuaternion(camera.quaternion)
          .normalize();

        const edgeWorld = worldPos
          .clone()
          .add(cameraRight.multiplyScalar(bodyWorldRadius));
        const edge = projectToScreen(edgeWorld);

        let screenRadius = Math.hypot(edge.x - center.x, edge.y - center.y);

        if (!Number.isFinite(screenRadius) || screenRadius < 1) {
          screenRadius = body.name === "Sun" ? 18 : 14;
        }

        const clickRadius =
          body.name === "Sun"
            ? Math.max(14, Math.min(28, screenRadius * 1.15))
            : Math.max(12, Math.min(34, screenRadius * 1.25));

        const hoverRadius =
          body.name === "Sun"
            ? Math.max(22, Math.min(46, screenRadius * 1.9))
            : Math.max(18, Math.min(56, screenRadius * 2));

        const allowedRadius = isClick ? clickRadius : hoverRadius;
        const d = Math.hypot(center.x - cx, center.y - cy);

        if (d < allowedRadius && d < bestD) {
          bestD = d;
          best = body;
        }
      });

      return best?.name || null;
    }

    function getPlanetScreenPos(name, scene) {
      const camera = scene?.camera;

      if (!camera || !spaceActive() || uiMode !== "solar") return null;
      if (!window.THREE) return null;

      const body = CLICKABLE_BODIES.find((x) => x.name === name);

      if (!body) return null;

      const el = getBodyElement(body);

      if (!el?.object3D) return null;

      const wp = new window.THREE.Vector3();
      el.object3D.getWorldPosition(wp);

      const proj = wp.clone().project(camera);

      if (proj.z > 1) return null;

      return {
        x: (proj.x * 0.5 + 0.5) * window.innerWidth,
        y: (1 - (proj.y * 0.5 + 0.5)) * window.innerHeight,
      };
    }

    function updateHover(scene) {
      if (
        window.__PLANET_MODAL_OPEN__ ||
        isPlanetFocusActive ||
        uiMode !== "solar" ||
        !spaceActive()
      ) {
        hoverLabel.style.opacity = "0";
        hoverNameEl.textContent = "";
        hoveredPlanet = null;
        return;
      }

      const inSolar =
        spaceActive() &&
        uiMode === "solar" &&
        zoomLevel >= 0.6 &&
        zoomLevel <= 3.2 &&
        !isPlanetFocusActive;

      if (!inSolar) {
        hoverLabel.style.opacity = "0";
        hoverNameEl.textContent = "";
        hoveredPlanet = null;
        return;
      }

      const name = getHoveredPlanet(mouseX, mouseY, scene);

      if (name !== hoveredPlanet) {
        hoveredPlanet = name;
        hoverNameEl.textContent = name || "";
        hoverLabel.style.opacity = name ? "1" : "0";
      }

      if (hoveredPlanet) {
        const pos = getPlanetScreenPos(hoveredPlanet, scene);

        if (pos) {
          hoverLabel.style.left = `${pos.x}px`;
          hoverLabel.style.top = `${pos.y}px`;
        } else {
          hoverLabel.style.opacity = "0";
          hoverNameEl.textContent = "";
          hoveredPlanet = null;
        }
      }
    }

    function renderLoop() {
      const scene = document.querySelector("#main-ar-scene");

      galaxyRot += uiMode === "galaxy" ? 0.00055 : 0.00025;

      zoomVelocity *= 0.88;
      zoomTarget += zoomVelocity;
      zoomTarget = Math.max(0.2, Math.min(5.5, zoomTarget));
      zoomLevel += (zoomTarget - zoomLevel) * 0.065;

      const isGalaxy =
        manualMode === "galaxy" || (!manualMode && zoomLevel < 0.6);

      isPlanetFocusActive = window.__PLANET_MODAL_OPEN__;

      const isSolar = manualMode === "solar" || !isGalaxy;
      uiMode = isGalaxy ? "galaxy" : "solar";

      const active = spaceActive();
      const activeSolarGroup = getActiveSolarGroup();

      if (!active || !isSolar) {
        hoverLabel.style.opacity = "0";
        hoverNameEl.textContent = "";
        hoveredPlanet = null;
      }

      if (markerSolarGroup) {
        markerSolarGroup.setAttribute(
          "visible",
          active && isSolar && markerFound ? "true" : "false",
        );
      }

      if (freeRoot) {
        freeRoot.setAttribute(
          "visible",
          active && isSolar && !markerFound ? "true" : "false",
        );
      }

      if (activeSolarGroup && isSolar) {
        const baseScale = usingFreeRoot() ? 1 : 0.82;
        const sc = Math.min(zoomLevel, 5.5) * baseScale;
        activeSolarGroup.setAttribute("scale", `${sc} ${sc} ${sc}`);
      }

      const gTarget = isGalaxy ? 1 : 0;
      const sTarget = isGalaxy ? 0.32 : isSolar ? 0.88 : 1;

      galaxyOpacity += (gTarget - galaxyOpacity) * 0.08;
      starOpacity += (sTarget - starOpacity) * 0.055;

      if (active) {
        if (isGalaxy) {
          planetFocusLabel.style.opacity = "0";
          bottomLabel.textContent =
            "🌌 Milky Way Galaxy — say “show solar system” to return";
          bottomLabel.style.opacity = galaxyOpacity > 0.28 ? "1" : "0";
        } else {
          planetFocusLabel.style.opacity = "0";
          bottomLabel.style.opacity = "0";
        }
      } else {
        bottomLabel.style.opacity = "0";
        planetFocusLabel.style.opacity = "0";
      }

      if (scene && !window.__PLANET_MODAL_OPEN__ && !isPlanetFocusActive) {
        updateHover(scene);
      }

      starCanvas.style.opacity = starOpacity.toFixed(4);
      galaxyCanvas.style.opacity = galaxyOpacity.toFixed(4);

      drawStars(starOpacity);
      drawGalaxy(galaxyOpacity);

      rafRender = requestAnimationFrame(renderLoop);
    }

    function setupPlanetInteraction() {
      const scene = document.querySelector("#main-ar-scene");

      if (!scene) return;

      const start = () => {
        const canvas = scene.canvas;

        if (!canvas) return;

        let downX = 0;
        let downY = 0;
        let lastPlanetDispatchAt = 0;

        function dispatchOnce(name) {
          const now = performance.now();

          if (now - lastPlanetDispatchAt < 250) return;

          lastPlanetDispatchAt = now;
          dispatchPlanetInfo(name);
        }

        canvas.addEventListener(
          "pointerdown",
          (event) => {
            downX = event.clientX;
            downY = event.clientY;
          },
          { passive: true },
        );

        canvas.addEventListener(
          "pointerup",
          (event) => {
            if (!isSolarInteractionActive()) return;

            if (
              Math.sqrt(
                (event.clientX - downX) ** 2 + (event.clientY - downY) ** 2,
              ) > 8
            ) {
              return;
            }

            const hit = getHoveredPlanet(
              event.clientX,
              event.clientY,
              scene,
              "click",
            );
            dispatchOnce(hit);
          },
          { passive: true },
        );
      };

      if (scene.hasLoaded) start();
      else scene.addEventListener("loaded", start, { once: true });
    }

    function handleWheel(event) {
      if (!spaceActive()) return;

      event.preventDefault();

      const delta = Math.max(-60, Math.min(60, event.deltaY));
      zoomVelocity += delta * 0.0028;
      zoomVelocity = Math.max(-0.18, Math.min(0.18, zoomVelocity));
    }

    function handleMouseMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      galaxyMouse.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      galaxyMouse.ty = (event.clientY / window.innerHeight - 0.5) * 2;

      if (
        !spaceActive() ||
        uiMode !== "solar" ||
        window.__PLANET_MODAL_OPEN__
      ) {
        hoverLabel.style.opacity = "0";
        hoverNameEl.textContent = "";
        hoveredPlanet = null;
      }
    }

    let lastPinch = null;

    function handleTouchStart(event) {
      if (event.touches.length === 2) {
        lastPinch = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY,
        );
      }
    }

    function handleTouchMove(event) {
      if (!spaceActive() || event.touches.length !== 2 || !lastPinch) return;

      const d = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      );

      zoomVelocity += (lastPinch - d) * 0.0045;
      zoomVelocity = Math.max(-0.18, Math.min(0.18, zoomVelocity));
      lastPinch = d;
    }

    function handleTouchEnd() {
      lastPinch = null;
    }

    function handleResize() {
      resizeCanvases();
    }

    resizeCanvases();
    enhanceSolarSystem();
    setSolarAnimationsPaused(paused);

    const scene = document.querySelector("#main-ar-scene");

    const startOrbitLoop = () => {
      if (engineDestroyed || rafOrbit) return;
      animateOrbits();
    };

    if (scene?.hasLoaded) startOrbitLoop();
    else if (scene)
      scene.addEventListener("loaded", startOrbitLoop, { once: true });
    else startOrbitLoop();

    setupPlanetInteraction();

    const marker = document.getElementById("hiro-marker");

    function onMarkerFound() {
      markerFound = true;
      manualMode = null;
      hidePlanetLabels();
      emitGalaxyMode();
      window.dispatchEvent(new CustomEvent("marker-found"));
    }

    function onMarkerLost() {
      markerFound = false;
      hidePlanetLabels();
      window.dispatchEvent(new CustomEvent("marker-lost"));
    }

    function onGalaxyModeRequest(event) {
      const requestedMode = event.detail?.mode || "hiro";

      if (requestedMode === "galaxy") {
        window.__galaxyAR?.showGalaxy?.();
      } else if (requestedMode === "solar") {
        window.__galaxyAR?.showSolar?.();
      } else {
        window.__galaxyAR?.useHiro?.();
      }
    }

    marker?.addEventListener("markerFound", onMarkerFound);
    marker?.addEventListener("markerLost", onMarkerLost);

    window.addEventListener("galaxy-mode-request", onGalaxyModeRequest);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    renderLoop();

    engineRef.current = window.__galaxyAR;

    return () => {
      engineDestroyed = true;
      cancelAnimationFrame(rafOrbit);
      cancelAnimationFrame(rafRender);
      scene?.removeEventListener("loaded", startOrbitLoop);

      marker?.removeEventListener("markerFound", onMarkerFound);
      marker?.removeEventListener("markerLost", onMarkerLost);

      window.removeEventListener("galaxy-mode-request", onGalaxyModeRequest);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      delete window.__galaxyAR;
      delete window.__GALAXY_AR_PAUSED__;
    };
  }, []);

  useEffect(() => {
    window.__GALAXY_AR_PAUSED__ = Boolean(isPaused);
    window.__galaxyAR?.setPaused?.(isPaused);
  }, [isPaused]);

  useEffect(() => {
    const applyMode = () => {
      if (!window.__galaxyAR) return;

      if (mode === "galaxy") {
        window.__galaxyAR.showGalaxy();
      } else if (mode === "solar") {
        window.__galaxyAR.showSolar();
      } else {
        window.__galaxyAR.useHiro();
      }
    };

    applyMode();
    const timers = [80, 180, 360, 720].map((delay) =>
      window.setTimeout(applyMode, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [mode]);

  return (
    <>
      <canvas id="star-canvas" />
      <canvas id="galaxy-canvas" />

      <div id="planet-hover-label">
        <span className="phl-name" />
      </div>
      <div id="bottom-label" />
      <div id="planet-focus-label" />

      <a-scene
        id="main-ar-scene"
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true; logarithmicDepthBuffer: true;"
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;"
      >
        <a-assets>
          <img id="sunTexture" src="/textures/sun.jpg" alt="" />
          <img id="mercuryTexture" src="/textures/mercury.jpg" alt="" />
          <img id="venusTexture" src="/textures/venus.jpg" alt="" />
          <img id="earthTexture" src="/textures/earth.jpg" alt="" />
          <img id="moonTexture" src="/textures/moon.jpg" alt="" />
          <img id="marsTexture" src="/textures/mars.jpg" alt="" />
          <img id="jupiterTexture" src="/textures/jupiter.jpg" alt="" />
          <img id="saturnTexture" src="/textures/saturn.jpg" alt="" />
          <img id="uranusTexture" src="/textures/uranus.jpg" alt="" />
          <img id="neptuneTexture" src="/textures/neptune.jpg" alt="" />
        </a-assets>

        <a-light type="ambient" color="#ffffff" intensity="1.8" />
        <a-light
          type="directional"
          color="#ffffff"
          intensity="1"
          position="1 3 2"
        />
        <a-light
          type="point"
          color="#ffcc44"
          intensity="2"
          position="0 0 0"
          distance="5"
          decay="2"
        />

        <a-marker
          id="hiro-marker"
          preset="hiro"
          emitevents="true"
          cursor="rayOrigin: mouse"
          raycaster="objects: .clickable"
        >
          <a-entity id="solar-system-group" scale="0.82 0.82 0.82">
            <a-sphere
              id="sun"
              class="clickable planet-sphere"
              data-planet="Sun"
              position="0 0.12 0"
              radius="0.12"
              material="src: url(textures/sun.jpg); emissive: #ff6600; emissiveIntensity: 0.9; roughness: 1;"
              animation="property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 15000; easing: linear;"
            />
            <a-sphere
              class="clickable"
              data-planet="Sun"
              position="0 0.12 0"
              radius="0.125"
              material="opacity: 0; transparent: true;"
            />
            <a-sphere
              position="0 0.12 0"
              radius="0.19"
              material="color:#ff8800;opacity:0.12;transparent:true;shader:flat;side:back;"
            />

            {[0.25, 0.38, 0.52, 0.65, 0.78, 0.88, 0.93, 1.0].map((radius) => (
              <a-torus
                key={radius}
                position="0 0.01 0"
                radius={radius}
                radius-tubular="0.003"
                segments-tubular="64"
                rotation="-90 0 0"
                material="color:#ffffff;opacity:0.2;transparent:true;shader:flat;"
              />
            ))}

            {PLANETS.map((planet) => (
              <a-entity
                key={planet.name}
                id={planet.id}
                class="planet-orbit"
                data-dist={planet.dist}
                data-speed={planet.speed}
                data-angle={planet.angle}
              >
                <a-sphere
                  class="clickable planet-sphere"
                  data-planet={planet.name}
                  radius={planet.size}
                  material={`src: url(${planet.texture}); roughness: 0.9;`}
                />

                {(planet.name === "Saturn" || planet.name === "Uranus") && (
                  <a-torus
                    radius={planet.name === "Saturn" ? "0.085" : "0.08"}
                    radius-tubular={
                      planet.name === "Saturn" ? "0.014" : "0.012"
                    }
                    segments-tubular={planet.name === "Saturn" ? "60" : "50"}
                    segments-radial={planet.name === "Saturn" ? "6" : "5"}
                    rotation="80 0 0"
                    material={
                      planet.name === "Saturn"
                        ? "color:#c8b080;opacity:0.75;transparent:true;roughness:1;side:double;"
                        : "color:#88cccc;opacity:0.45;transparent:true;side:double;"
                    }
                  />
                )}

                <a-sphere
                  class="clickable"
                  data-planet={planet.name}
                  radius={planet.size * 2.2}
                  material="opacity:0;transparent:true;"
                />
              </a-entity>
            ))}
          </a-entity>
        </a-marker>

        <a-entity
          id="free-space-root"
          position="0 -0.18 -2.35"
          rotation="62 0 0"
          scale="1.18 1.18 1.18"
          visible="false"
        />

        <a-entity camera />
      </a-scene>
    </>
  );
}

export default ARScene;