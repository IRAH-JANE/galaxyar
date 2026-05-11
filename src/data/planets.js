const planets = {
  Sun: {
    name: "Sun",
    texture: "/textures/sun.jpg",
    color: "#ffb347",
    type: "G-type main-sequence star",
    orderFromSun: 0,

    desc: "The Sun is the star at the center of our solar system. Its gravity holds the planets, moons, asteroids, and comets in orbit.",
    longDesc:
      "The Sun is the heart of the Solar System and the main source of light, heat, and energy for Earth. It is a massive sphere of hot plasma powered by nuclear fusion in its core, where hydrogen is converted into helium. Without the Sun’s gravity, the planets would not stay in orbit, and without its energy, life on Earth would not exist.",

    gravity: "274 m/s²",
    moons: 0,
    diameter: "1,392,700 km",
    temperature: "5,500°C surface / ~15,000,000°C core",
    atmosphere: "Hot plasma made mostly of hydrogen and helium",
    dayLength: "~27 Earth days",
    yearLength: "~230 million years around the Milky Way",
    distanceFromSun: "Center of the Solar System",
    orbitalSpeed: "~220 km/s around the Milky Way",
    mass: "1.989 × 10^30 kg",
    escapeVelocity: "617.7 km/s",
    axialTilt: "7.25°",

    age: "About 4.6 billion years",
    discoveredBy: "Known since prehistoric times",
    surface:
      "The Sun has no solid surface. Its visible layer is called the photosphere.",
    rotation: "Rotates once every ~27 Earth days near the equator",
    mainMoons: "None",
    magneticField: "Very strong and constantly changing",
    composition: "About 74% hydrogen and 24% helium",
    knownFor: "Provides light, heat, and energy for all life on Earth",
    notableFeature:
      "Solar flares, sunspots, solar wind, and coronal mass ejections",
    exploration: "Observed by Parker Solar Probe, SOHO, and Solar Orbiter",
    whyImportant:
      "The Sun powers Earth’s climate, weather, photosynthesis, and the orbital structure of the entire Solar System.",

    nasaFact:
      "The Sun contains about 99.86% of the mass of the entire Solar System.",
    funFact: "More than one million Earths could fit inside the Sun.",
    rings: null,
  },

  Mercury: {
    name: "Mercury",
    texture: "/textures/mercury.jpg",
    color: "#c8c8c8",
    type: "Terrestrial planet",
    orderFromSun: 1,

    desc: "Mercury is the smallest planet and the closest planet to the Sun. It has a rocky surface covered with craters.",
    longDesc:
      "Mercury is a small rocky planet with a heavily cratered surface that looks similar to the Moon. Because it is closest to the Sun and has almost no atmosphere, Mercury experiences extreme temperature changes between day and night. It also has the shortest year of all planets because it races around the Sun faster than any other planet.",

    gravity: "3.7 m/s²",
    moons: 0,
    diameter: "4,879 km",
    temperature: "167°C avg (430°C day / -180°C night)",
    atmosphere:
      "Very thin exosphere of oxygen, sodium, hydrogen, helium, and potassium",
    dayLength: "59 Earth days",
    yearLength: "88 Earth days",
    distanceFromSun: "57.9 million km (0.39 AU)",
    orbitalSpeed: "47.4 km/s",
    mass: "3.30 × 10^23 kg",
    escapeVelocity: "4.25 km/s",
    axialTilt: "0.03°",

    age: "About 4.5 billion years",
    discoveredBy: "Known since ancient times",
    surface: "Rocky, cratered, and covered with cliffs and impact basins",
    rotation: "Rotates very slowly, once every 59 Earth days",
    mainMoons: "None",
    magneticField: "Weak global magnetic field",
    composition: "Large iron core with a rocky outer shell",
    knownFor: "Fastest orbit around the Sun",
    notableFeature:
      "The Caloris Basin, one of the largest impact basins on Mercury",
    exploration:
      "Visited by Mariner 10 and MESSENGER; BepiColombo is currently studying Mercury",
    whyImportant:
      "Mercury helps scientists understand how rocky planets formed close to the Sun.",

    nasaFact: "NASA’s MESSENGER spacecraft orbited Mercury from 2011 to 2015.",
    funFact:
      "Mercury has almost no atmosphere, so its temperatures swing dramatically between day and night.",
    rings: null,
  },

  Venus: {
    name: "Venus",
    texture: "/textures/venus.jpg",
    color: "#e0b56f",
    type: "Terrestrial planet",
    orderFromSun: 2,

    desc: "Venus is the second planet from the Sun and is often called Earth’s sister planet because of its similar size.",
    longDesc:
      "Venus is similar to Earth in size and structure, but its environment is extremely different. It has a thick carbon dioxide atmosphere that traps heat through a runaway greenhouse effect, making Venus the hottest planet in the Solar System. Its surface is hidden below dense clouds of sulfuric acid, and its pressure is strong enough to crush spacecraft quickly.",

    gravity: "8.87 m/s²",
    moons: 0,
    diameter: "12,104 km",
    temperature: "465°C average",
    atmosphere: "Mostly carbon dioxide with clouds of sulfuric acid",
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    distanceFromSun: "108.2 million km (0.72 AU)",
    orbitalSpeed: "35.0 km/s",
    mass: "4.87 × 10^24 kg",
    escapeVelocity: "10.36 km/s",
    axialTilt: "177.4°",

    age: "About 4.5 billion years",
    discoveredBy: "Known since ancient times",
    surface: "Rocky plains, volcanoes, mountains, and lava-covered terrain",
    rotation: "Rotates backward very slowly, once every 243 Earth days",
    mainMoons: "None",
    magneticField: "No strong global magnetic field",
    composition: "Rocky interior with an iron core and thick atmosphere",
    knownFor: "Hottest planet in the Solar System",
    notableFeature: "Runaway greenhouse effect and thick cloud cover",
    exploration:
      "Studied by Magellan, Akatsuki, Venera missions, and other spacecraft",
    whyImportant:
      "Venus helps scientists study climate change, greenhouse gases, and how Earth-like planets can evolve differently.",

    nasaFact:
      "Venus rotates backward compared with most planets in the Solar System.",
    funFact: "A day on Venus is longer than a year on Venus.",
    rings: null,
  },

  Earth: {
    name: "Earth",
    texture: "/textures/earth.jpg",
    color: "#4f9fff",
    type: "Terrestrial planet",
    orderFromSun: 3,

    desc: "Earth is the third planet from the Sun and the only known world that supports life.",
    longDesc:
      "Earth is the only known planet with liquid water on its surface and life. Its atmosphere protects living things, helps regulate temperature, and allows weather systems to exist. Earth’s magnetic field shields the planet from harmful solar particles, while its Moon stabilizes Earth’s tilt and influences ocean tides.",

    gravity: "9.8 m/s²",
    moons: 1,
    diameter: "12,742 km",
    temperature: "15°C average",
    atmosphere: "78% nitrogen, 21% oxygen, and traces of other gases",
    dayLength: "24 hours",
    yearLength: "365.25 days",
    distanceFromSun: "149.6 million km (1 AU)",
    orbitalSpeed: "29.8 km/s",
    mass: "5.97 × 10^24 kg",
    escapeVelocity: "11.2 km/s",
    axialTilt: "23.5°",

    age: "About 4.5 billion years",
    discoveredBy: "Home planet; known since human existence",
    surface:
      "Rocky continents, oceans, polar ice, deserts, forests, and mountains",
    rotation: "Rotates once every 24 hours",
    mainMoons: "The Moon",
    magneticField:
      "Strong global magnetic field generated by its liquid outer core",
    composition: "Rocky crust, mantle, iron-nickel core, and liquid water",
    knownFor: "Only known planet with life",
    notableFeature: "Liquid surface water and a life-supporting atmosphere",
    exploration:
      "Observed continuously by satellites, astronauts, probes, and Earth science missions",
    whyImportant:
      "Earth is the standard scientists use to compare habitability, climate, geology, and life on other worlds.",

    nasaFact: "About 71% of Earth’s surface is covered by water.",
    funFact: "Earth is the only planet not named after a Roman or Greek god.",
    rings: null,
  },

  Mars: {
    name: "Mars",
    texture: "/textures/mars.jpg",
    color: "#ff6b3a",
    type: "Terrestrial planet",
    orderFromSun: 4,

    desc: "Mars is the fourth planet from the Sun and is known as the Red Planet because of iron oxide on its surface.",
    longDesc:
      "Mars is a cold desert world with a thin atmosphere, polar ice caps, volcanoes, canyons, and evidence that liquid water once flowed on its surface. Scientists study Mars because it may have had conditions suitable for life in the distant past. Its surface is currently explored by robotic rovers and orbiters.",

    gravity: "3.71 m/s²",
    moons: 2,
    diameter: "6,779 km",
    temperature: "-63°C average",
    atmosphere: "Thin carbon dioxide atmosphere",
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    distanceFromSun: "227.9 million km (1.52 AU)",
    orbitalSpeed: "24.1 km/s",
    mass: "6.42 × 10^23 kg",
    escapeVelocity: "5.03 km/s",
    axialTilt: "25.2°",

    age: "About 4.5 billion years",
    discoveredBy: "Known since ancient times",
    surface:
      "Rocky desert surface with dust, volcanoes, canyons, and polar ice",
    rotation: "Rotates once every 24.6 hours",
    mainMoons: "Phobos and Deimos",
    magneticField:
      "No strong global magnetic field, but some crustal magnetism remains",
    composition: "Rocky crust, iron-rich soil, and polar ice caps",
    knownFor: "Home to Olympus Mons and Valles Marineris",
    notableFeature: "Olympus Mons, the tallest volcano in the Solar System",
    exploration:
      "Explored by orbiters, landers, and rovers like Curiosity and Perseverance",
    whyImportant:
      "Mars is a major target in the search for past life and future human exploration.",

    nasaFact:
      "Olympus Mons on Mars is the tallest volcano in the Solar System.",
    funFact: "Mars has seasons because its axial tilt is similar to Earth’s.",
    rings: null,
  },

  Jupiter: {
    name: "Jupiter",
    texture: "/textures/jupiter.jpg",
    color: "#e0a15e",
    type: "Gas giant",
    orderFromSun: 5,

    desc: "Jupiter is the fifth planet from the Sun and the largest planet in the Solar System.",
    longDesc:
      "Jupiter is a huge gas giant made mostly of hydrogen and helium. Its powerful gravity influences asteroids, comets, and many objects in the outer Solar System. Jupiter is famous for its colorful cloud bands, strong magnetic field, many moons, and the Great Red Spot, a giant storm larger than Earth.",

    gravity: "24.79 m/s²",
    moons: 95,
    diameter: "139,820 km",
    temperature: "-110°C average cloud-top",
    atmosphere: "Mostly hydrogen and helium",
    dayLength: "9.9 hours",
    yearLength: "11.86 Earth years",
    distanceFromSun: "778.5 million km (5.20 AU)",
    orbitalSpeed: "13.1 km/s",
    mass: "1.90 × 10^27 kg",
    escapeVelocity: "59.5 km/s",
    axialTilt: "3.1°",

    age: "About 4.5 billion years",
    discoveredBy: "Known since ancient times",
    surface:
      "No solid surface; deep layers of gas and liquid metallic hydrogen",
    rotation: "Fastest rotating planet, completing one day in about 9.9 hours",
    mainMoons: "Io, Europa, Ganymede, and Callisto",
    magneticField:
      "Extremely strong magnetic field, the strongest of any planet",
    composition: "Hydrogen-helium gas envelope with possible rocky core",
    knownFor: "The Great Red Spot storm",
    notableFeature: "Ganymede, Jupiter’s largest moon, is bigger than Mercury",
    exploration:
      "Visited by Juno, Voyager, Galileo, Pioneer, and other missions",
    whyImportant:
      "Jupiter helps scientists understand gas giants, planetary magnetism, and moon systems that may contain subsurface oceans.",

    nasaFact:
      "Jupiter’s Great Red Spot is a giant storm that has lasted for centuries.",
    funFact:
      "Jupiter is so large that more than 1,300 Earths could fit inside it.",
    rings: null,
  },

  Saturn: {
    name: "Saturn",
    texture: "/textures/saturn.jpg",
    color: "#ead28a",
    type: "Gas giant",
    orderFromSun: 6,

    desc: "Saturn is the sixth planet from the Sun and is famous for its bright ring system.",
    longDesc:
      "Saturn is a gas giant best known for its spectacular rings made of ice and rock particles. Like Jupiter, it is mostly hydrogen and helium and has no solid surface. Saturn also has a large moon system, including Titan, which has a thick atmosphere and lakes of liquid methane and ethane.",

    gravity: "10.44 m/s²",
    moons: 274,
    diameter: "116,460 km",
    temperature: "-140°C average cloud-top",
    atmosphere: "Mostly hydrogen and helium",
    dayLength: "10.7 hours",
    yearLength: "29.45 Earth years",
    distanceFromSun: "1.43 billion km (9.58 AU)",
    orbitalSpeed: "9.7 km/s",
    mass: "5.68 × 10^26 kg",
    escapeVelocity: "35.5 km/s",
    axialTilt: "26.7°",

    age: "About 4.5 billion years",
    discoveredBy: "Known since ancient times",
    surface: "No solid surface; layers of gas and liquid metallic hydrogen",
    rotation: "Rotates once every 10.7 hours",
    mainMoons: "Titan, Enceladus, Rhea, Iapetus, Dione, and Tethys",
    magneticField: "Strong global magnetic field",
    composition: "Gas giant with icy ring particles and possible rocky core",
    knownFor: "Most spectacular ring system",
    notableFeature: "Titan has a thick atmosphere and liquid hydrocarbon lakes",
    exploration:
      "Studied closely by Cassini-Huygens, Voyager, and Pioneer missions",
    whyImportant:
      "Saturn helps scientists study ring systems, giant planets, and potentially habitable icy moons.",

    nasaFact: "Saturn’s rings are made mostly of ice and rock particles.",
    funFact:
      "Saturn is less dense than water — it would float if you had a giant enough ocean.",
    rings: {
      radius: 1.45,
      tube: 0.22,
      color: "#d7c18c",
      opacity: 0.78,
    },
  },

  Uranus: {
    name: "Uranus",
    texture: "/textures/uranus.jpg",
    color: "#88efff",
    type: "Ice giant",
    orderFromSun: 7,

    desc: "Uranus is the seventh planet from the Sun and rotates on its side.",
    longDesc:
      "Uranus is an ice giant with a blue-green color caused by methane in its atmosphere. It is famous for its extreme axial tilt, which makes the planet appear to roll around the Sun. This unusual tilt gives Uranus extreme seasons that can last for decades.",

    gravity: "8.69 m/s²",
    moons: 29,
    diameter: "50,724 km",
    temperature: "-195°C average",
    atmosphere: "Hydrogen, helium, and methane",
    dayLength: "17.2 hours",
    yearLength: "84 Earth years",
    distanceFromSun: "2.87 billion km (19.2 AU)",
    orbitalSpeed: "6.8 km/s",
    mass: "8.68 × 10^25 kg",
    escapeVelocity: "21.3 km/s",
    axialTilt: "97.8°",

    age: "About 4.5 billion years",
    discoveredBy: "William Herschel in 1781",
    surface:
      "Uranus has no solid surface. It is an ice giant with layers of gas, icy fluids, and a small rocky core.",
    rotation: "Rotates once every 17.2 hours and spins on its side",
    mainMoons: "Titania, Oberon, Umbriel, Ariel, and Miranda",
    magneticField:
      "Tilted and off-center compared with the planet’s rotation axis",
    composition:
      "Ices, rock, and gas with methane giving it a blue-green color",
    knownFor: "Extreme axial tilt",
    notableFeature:
      "Its extreme 97.8° axial tilt makes it appear to roll around the Sun.",
    exploration: "Visited by Voyager 2",
    whyImportant:
      "Uranus helps scientists understand ice giants, unusual magnetic fields, and planetary formation far from the Sun.",

    nasaFact:
      "Uranus appears to roll around the Sun because it is tilted so dramatically.",
    funFact: "Uranus was the first planet discovered with a telescope.",
    rings: {
      radius: 1.28,
      tube: 0.1,
      color: "#9de8f3",
      opacity: 0.45,
    },
  },

  Neptune: {
    name: "Neptune",
    texture: "/textures/neptune.jpg",
    color: "#5d7cff",
    type: "Ice giant",
    orderFromSun: 8,

    desc: "Neptune is the eighth and farthest known planet from the Sun. It is a deep blue world with extreme winds.",
    longDesc:
      "Neptune is a distant ice giant known for its deep blue color, powerful storms, and extremely fast winds. It was discovered through mathematics before it was directly observed, because astronomers noticed that Uranus was not moving exactly as expected. Neptune’s moon Triton is especially interesting because it may be a captured Kuiper Belt object.",

    gravity: "11.15 m/s²",
    moons: 16,
    diameter: "49,244 km",
    temperature: "-200°C average",
    atmosphere: "Hydrogen, helium, and methane",
    dayLength: "16.1 hours",
    yearLength: "164.8 Earth years",
    distanceFromSun: "4.50 billion km (30.1 AU)",
    orbitalSpeed: "5.4 km/s",
    mass: "1.02 × 10^26 kg",
    escapeVelocity: "23.5 km/s",
    axialTilt: "28.3°",

    age: "About 4.5 billion years",
    discoveredBy: "Johann Galle and Urbain Le Verrier in 1846",
    surface:
      "No solid surface; an ice giant with deep layers of icy fluids and gas",
    rotation: "Rotates once every 16.1 hours",
    mainMoons: "Triton, Proteus, Nereid, and other small moons",
    magneticField: "Tilted and offset from the planet’s center",
    composition: "Ices, rock, and gas with methane-rich atmosphere",
    knownFor: "Fastest winds in the Solar System",
    notableFeature: "Triton orbits Neptune backward and may have been captured",
    exploration: "Visited by Voyager 2",
    whyImportant:
      "Neptune helps scientists study the outer Solar System, ice giants, and distant planetary atmospheres.",

    nasaFact: "Neptune has winds that can exceed 2,000 km/h.",
    funFact:
      "Neptune was discovered using mathematics before it was seen through a telescope.",
    rings: null,
  },
};

export default planets;
