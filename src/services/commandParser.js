/**
 * Utility to parse a raw voice command string into an action type.
 * Actual state changes are handled in App.jsx — this is just a classifier.
 */
export function parseCommand(raw) {
  raw = raw.toLowerCase();

  if (raw.includes("zoom in")) return { type: "ZOOM_IN" };
  if (raw.includes("zoom out")) return { type: "ZOOM_OUT" };
  if (raw.includes("pause")) return { type: "PAUSE" };
  if (raw.includes("resume")) return { type: "RESUME" };
  if (raw.includes("sleep") || raw.includes("goodbye"))
    return { type: "SLEEP" };

  const planetNames = [
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];
  const found = planetNames.find((p) => raw.includes(p));
  if (found) return { type: "PLANET", planet: found };

  return { type: "UNKNOWN" };
}