import React, { useMemo } from "react";

function Planet({ planet, layout, index, isPaused }) {
  const angle = useMemo(() => index * 42 + 20, [index]);
  const textureId = `${planet.name.toLowerCase()}Texture`;

  const orbitAnimation = isPaused
    ? ""
    : `property: rotation; from: 0 ${angle} 0; to: 0 ${
        angle + 360
      } 0; loop: true; dur: ${layout.orbitDuration}; easing: linear;`;

  const spinAnimation = isPaused
    ? ""
    : `property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: ${layout.spinDuration}; easing: linear;`;

  const openPlanet = () => {
    window.dispatchEvent(
      new CustomEvent("planet-clicked", {
        detail: { name: planet.name },
      }),
    );
  };

  return (
    <>
      <a-torus
        position="0 0.01 0"
        radius={layout.distance}
        radius-tubular="0.003"
        segments-tubular="144"
        segments-radial="8"
        rotation="-90 0 0"
        material={`color:${planet.color};opacity:0.26;transparent:true;shader:flat;`}
      />

      <a-torus
        position="0 0.01 0"
        radius={layout.distance}
        radius-tubular="0.009"
        segments-tubular="144"
        segments-radial="8"
        rotation="-90 0 0"
        material={`color:${planet.color};opacity:0.055;transparent:true;shader:flat;`}
      />

      <a-entity animation={orbitAnimation}>
        <a-entity position={`${layout.distance} 0.12 0`}>
          <a-sphere
            class="clickable planet-sphere"
            data-planet={planet.name}
            radius={layout.radius}
            material={`src: #${textureId}; roughness: 0.9; metalness: 0;`}
            animation={spinAnimation}
            onClick={openPlanet}
          />

          <a-sphere
            class="clickable"
            data-planet={planet.name}
            radius={layout.radius * 1.9}
            material="opacity:0;transparent:true;"
            onClick={openPlanet}
          />

          <a-sphere
            radius={layout.radius * 1.85}
            material={`color:${planet.color};opacity:0.13;transparent:true;shader:flat;side:back;`}
          />

          <a-sphere
            radius={layout.radius * 1.28}
            material={`color:${planet.color};opacity:0.09;transparent:true;shader:flat;side:back;`}
          />

          {planet.rings && (
            <>
              <a-torus
                radius={layout.radius * planet.rings.radius}
                radius-tubular={layout.radius * planet.rings.tube}
                segments-tubular="72"
                segments-radial="8"
                rotation="80 0 0"
                material={`color:${planet.rings.color};opacity:${planet.rings.opacity};transparent:true;shader:flat;side:double;`}
              />

              <a-torus
                radius={layout.radius * (planet.rings.radius + 0.26)}
                radius-tubular={layout.radius * 0.055}
                segments-tubular="72"
                segments-radial="8"
                rotation="80 0 0"
                material={`color:${planet.rings.color};opacity:0.28;transparent:true;shader:flat;side:double;`}
              />
            </>
          )}
        </a-entity>
      </a-entity>
    </>
  );
}

export default Planet;
