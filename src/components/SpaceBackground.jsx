import React from "react";

function SpaceBackground() {
  return (
    <>
      <a-sky src="/textures/stars.jpg"></a-sky>

      <a-entity
        particle-system="
          preset: snow;
          color: #ffffff;
          particleCount: 1000;
        "
      />
    </>
  );
}

export default SpaceBackground;