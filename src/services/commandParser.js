export function normalizeSpeech(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasWakeWord(text) {
  return (
    text.includes("hey galaxy") ||
    text.includes("okay galaxy") ||
    text.includes("ok galaxy") ||
    text.includes("hello galaxy") ||
    text === "galaxy"
  );
}

export function stripWakeWords(text) {
  return text
    .replace(/\bhey galaxy\b/g, "")
    .replace(/\bokay galaxy\b/g, "")
    .replace(/\bok galaxy\b/g, "")
    .replace(/\bhello galaxy\b/g, "")
    .trim();
}

export function findPlanetName(raw) {
  const aliases = {
    sun: "Sun",
    star: "Sun",
    "the sun": "Sun",

    mercury: "Mercury",
    venus: "Venus",
    earth: "Earth",
    world: "Earth",
    mars: "Mars",
    "red planet": "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
  };

  return (
    Object.entries(aliases).find(([key]) => raw.includes(key))?.[1] || null
  );
}

function ordinal(n) {
  if (n === 0) return "the center of the Solar System";
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

export function getFactAnswer(raw, planetName, planets) {
  const planet = planets[planetName];

  if (!planet) return null;

  if (raw.includes("how many moon") || raw.includes("moons")) {
    return {
      title: `${planetName} — Moons`,
      body:
        planetName === "Sun"
          ? "The Sun does not have moons. It is the star that planets and many smaller bodies orbit."
          : `${planetName} has ${planet.moons} moon${planet.moons !== 1 ? "s" : ""}.`,
    };
  }

  if (
    raw.includes("position") ||
    raw.includes("order") ||
    raw.includes("from the sun") ||
    raw.includes("closest") ||
    raw.includes("first planet") ||
    raw.includes("second planet") ||
    raw.includes("third planet")
  ) {
    const position =
      planet.orderFromSun === 0
        ? "The Sun is the center star of the Solar System."
        : `${planetName} is the ${ordinal(planet.orderFromSun)} planet from the Sun.`;

    return {
      title: `${planetName} — Position`,
      body: position,
    };
  }

  if (
    raw.includes("distance") ||
    raw.includes("far") ||
    raw.includes("how far")
  ) {
    return {
      title: `${planetName} — Distance from Sun`,
      body: `${planetName}'s distance from the Sun is ${planet.distanceFromSun}.`,
    };
  }

  if (
    raw.includes("temperature") ||
    raw.includes("hot") ||
    raw.includes("cold")
  ) {
    return {
      title: `${planetName} — Temperature`,
      body: `${planetName}'s temperature is ${planet.temperature}.`,
    };
  }

  if (raw.includes("gravity")) {
    return {
      title: `${planetName} — Gravity`,
      body: `${planetName}'s gravity is ${planet.gravity}.`,
    };
  }

  if (raw.includes("atmosphere")) {
    return {
      title: `${planetName} — Atmosphere`,
      body: `${planetName}'s atmosphere is ${planet.atmosphere}.`,
    };
  }

  if (raw.includes("diameter") || raw.includes("size") || raw.includes("big")) {
    return {
      title: `${planetName} — Diameter`,
      body: `${planetName}'s diameter is ${planet.diameter}.`,
    };
  }

  if (raw.includes("mass") || raw.includes("heavy")) {
    return {
      title: `${planetName} — Mass`,
      body: `${planetName}'s mass is ${planet.mass}.`,
    };
  }

  if (raw.includes("type") || raw.includes("kind")) {
    return {
      title: `${planetName} — Type`,
      body: `${planetName} is a ${planet.type}.`,
    };
  }

  if (raw.includes("composition") || raw.includes("made of")) {
    return {
      title: `${planetName} — Composition`,
      body: `${planetName} is made of: ${planet.composition}.`,
    };
  }

  if (raw.includes("known for") || raw.includes("famous")) {
    return {
      title: `${planetName} — Known For`,
      body: `${planetName} is known for: ${planet.knownFor}.`,
    };
  }

  if (
    raw.includes("exploration") ||
    raw.includes("mission") ||
    raw.includes("visited")
  ) {
    return {
      title: `${planetName} — Exploration`,
      body: planet.exploration,
    };
  }

  if (raw.includes("orbital speed") || raw.includes("speed")) {
    return {
      title: `${planetName} — Orbital Speed`,
      body: `${planetName}'s orbital speed is ${planet.orbitalSpeed}.`,
    };
  }

  if (raw.includes("escape velocity")) {
    return {
      title: `${planetName} — Escape Velocity`,
      body: `${planetName}'s escape velocity is ${planet.escapeVelocity}.`,
    };
  }

  if (raw.includes("tilt") || raw.includes("axial")) {
    return {
      title: `${planetName} — Axial Tilt`,
      body: `${planetName}'s axial tilt is ${planet.axialTilt}.`,
    };
  }

  if (raw.includes("day length") || raw.includes("one day")) {
    return {
      title: `${planetName} — Day Length`,
      body: `One day on ${planetName} is ${planet.dayLength}.`,
    };
  }

  if (raw.includes("year length") || raw.includes("one year")) {
    return {
      title: `${planetName} — Year Length`,
      body: `One year on ${planetName} is ${planet.yearLength}.`,
    };
  }

  if (raw.includes("nasa")) {
    return {
      title: `${planetName} — NASA Fact`,
      body: planet.nasaFact,
    };
  }

  if (raw.includes("fun fact") || raw.includes("fact")) {
    return {
      title: `${planetName} — Fun Fact`,
      body: planet.funFact,
    };
  }

  return null;
}
