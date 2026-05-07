import React, { useEffect, useState, useRef } from "react";
import Planet from "./Planet";

function ARScene({ planets, isPaused, onPlanetClick }) {
  const [angles, setAngles] = useState(() =>
    new Array(Object.keys(planets).length).fill(0),
  );

  const sceneRef = useRef(null);
  // Always-current ref so stale closures never miss a callback update
  const onPlanetClickRef = useRef(onPlanetClick);
  useEffect(() => {
    onPlanetClickRef.current = onPlanetClick;
  }, [onPlanetClick]);

  // ── Orbit animation ──────────────────────────────────────────
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

  // ── Click detection — three independent methods so one always works ──
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // ── Method 1: scene-level DOM click (catches A-Frame entity clicks) ──
    // Uses the ref so the callback is always fresh — never stale.
    const onSceneClick = (e) => {
      const name = e.target?.getAttribute?.("data-planet");
      if (name) {
        onPlanetClickRef.current?.(name);
        return;
      }
      // Walk up the DOM in case click landed on a child of the entity
      let el = e.target;
      while (el && el !== scene) {
        const n = el.getAttribute?.("data-planet");
        if (n) {
          onPlanetClickRef.current?.(n);
          return;
        }
        el = el.parentElement;
      }
    };

    // ── Method 2: canvas pointer — manual THREE.js raycast ──
    // This fires even when A-Frame's own raycaster has gone stale.
    const onCanvasPointer = (e) => {
      const canvas = scene.canvas;
      if (!canvas) return;
      const camera = scene.camera;
      if (!camera) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const mx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const my = -((clientY - rect.top) / rect.height) * 2 + 1;

      try {
        const THREE =
          window.THREE ||
          scene.object3D?.children?.[0]?.position?.constructor?.prototype;
        const raycaster = new scene.systems["raycaster"]()
          ? null // skip — use Method 1 in that case
          : null;

        // Simpler: walk all A-Frame entities with data-planet
        const entities = scene.querySelectorAll("[data-planet]");
        let closest = null;
        let closestDist = Infinity;

        entities.forEach((el) => {
          if (!el.object3D) return;
          // Get 2D screen position of the entity's world position
          const worldPos = new el.object3D.position.constructor();
          el.object3D.getWorldPosition(worldPos);
          worldPos.project(camera);

          const dx = worldPos.x - mx;
          const dy = worldPos.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Threshold: ~10% of screen width in NDC units
          if (dist < 0.12 && dist < closestDist) {
            closestDist = dist;
            closest = el.getAttribute("data-planet");
          }
        });

        if (closest) onPlanetClickRef.current?.(closest);
      } catch (_) {
        // Method 2 failed silently — Method 1 or 3 will cover it
      }
    };

    // ── Method 3: A-Frame entity-level click events ──
    // Register directly on each planet entity so AR.js marker re-detection
    // doesn't break the listener chain.
    const planetEls = [];
    const onEntityClick = (e) => {
      const name = e.currentTarget?.getAttribute?.("data-planet");
      if (name) onPlanetClickRef.current?.(name);
    };

    const attachEntityListeners = () => {
      scene.querySelectorAll("[data-planet]").forEach((el) => {
        el.addEventListener("click", onEntityClick);
        planetEls.push(el);
      });
    };

    // ── Attach all three methods ──
    const attach = () => {
      scene.addEventListener("click", onSceneClick);
      scene.canvas?.addEventListener("pointerdown", onCanvasPointer);
      scene.canvas?.addEventListener("touchstart", onCanvasPointer, {
        passive: true,
      });
      attachEntityListeners();
    };

    if (scene.hasLoaded) {
      attach();
    } else {
      scene.addEventListener("loaded", attach, { once: true });
    }

    // Re-attach entity listeners whenever the marker is found
    // (marker re-detection rebuilds the 3D objects, invalidating old listeners)
    const marker =
      scene.querySelector("[preset='hiro']") || scene.querySelector("a-marker");
    const onMarkerFound = () => {
      // Small delay so A-Frame finishes rebuilding entities
      setTimeout(() => {
        planetEls.forEach((el) =>
          el.removeEventListener("click", onEntityClick),
        );
        planetEls.length = 0;
        attachEntityListeners();
      }, 300);
    };
    marker?.addEventListener("markerFound", onMarkerFound);

    return () => {
      scene.removeEventListener("click", onSceneClick);
      scene.canvas?.removeEventListener("pointerdown", onCanvasPointer);
      scene.canvas?.removeEventListener("touchstart", onCanvasPointer);
      planetEls.forEach((el) => el.removeEventListener("click", onEntityClick));
      marker?.removeEventListener("markerFound", onMarkerFound);
    };
  }, []); // empty deps — the ref keeps callback fresh without re-running

  return (
    <a-scene
      ref={sceneRef}
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      renderer="alpha: true; antialias: true; logarithmicDepthBuffer: true;"
      arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono;"
      cursor="rayOrigin: mouse"
      raycaster="objects: .clickable; far: 100"
    >
      <a-light type="ambient" color="#ffffff" intensity="1.5" />
      <a-light
        type="directional"
        color="#ffffff"
        intensity="1.0"
        position="1 2 1"
      />
      <a-light
        type="point"
        color="#ffcc44"
        intensity="2.0"
        position="0 0 0"
        distance="5"
        decay="2"
      />

      <a-marker
        preset="hiro"
        smooth="true"
        smoothCount="10"
        smoothTolerance="0.01"
        smoothThreshold="5"
        emitevents="true"
      >
        <a-entity scale="1 1 1">
          {/* SUN */}
          <a-sphere
            position="0 0.12 0"
            radius="0.12"
            material="src: /textures/sun.jpg; emissive: #ff6600; emissiveIntensity: 0.8;"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear"
          />
          <a-sphere
            position="0 0.12 0"
            radius="0.19"
            material="color: #ff8800; opacity: 0.1; transparent: true; shader: flat; side: back;"
          />

          {/* ORBIT RINGS */}
          {Object.values(planets).map((planet, i) => (
            <a-torus
              key={`orbit-${i}`}
              position="0 0.01 0"
              radius={planet.distance}
              radius-tubular="0.003"
              segments-tubular="80"
              rotation="-90 0 0"
              material="color: #ffffff; opacity: 0.18; transparent: true; shader: flat;"
            />
          ))}

          {/* PLANETS */}
          {Object.entries(planets).map(([name, planet], i) => (
            <Planet key={name} planet={{ ...planet, name }} angle={angles[i]} />
          ))}
        </a-entity>
      </a-marker>
    </a-scene>
  );
}

export default ARScene;
