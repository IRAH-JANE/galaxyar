import React, { useState, useEffect, useRef } from "react";

function App() {
  const [info, setInfo] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  const [angles, setAngles] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  // 🎤 VOICE STATE
  const [listening, setListening] = useState(false);
  const [awake, setAwake] = useState(false);

  const recognitionRef = useRef(null);
  const wakeTimeout = useRef(null);
  const lastHeard = useRef(Date.now());

  const planetData = {
    Mercury: { desc: "Smallest planet", texture: "/textures/mercury.jpg" },
    Venus: { desc: "Hottest planet", texture: "/textures/venus.jpg" },
    Earth: { desc: "Our home", texture: "/textures/earth.jpg" },
    Mars: { desc: "Red planet", texture: "/textures/mars.jpg" },
    Jupiter: { desc: "Largest planet", texture: "/textures/jupiter.jpg" },
    Saturn: { desc: "Ring planet", texture: "/textures/saturn.jpg" },
    Uranus: { desc: "Ice giant", texture: "/textures/uranus.jpg" },
    Neptune: { desc: "Windy planet", texture: "/textures/neptune.jpg" },
  };

  const names = Object.keys(planetData);
  const distances = [1.2, 1.7, 2.2, 2.8, 3.5, 4.3, 5.1, 5.8];
  const speeds = [0.015, 0.012, 0.009, 0.007, 0.005, 0.004, 0.003, 0.002];
  const sizes = [0.1, 0.15, 0.18, 0.2, 0.35, 0.3, 0.25, 0.25];

  // 🌌 ORBITS
  useEffect(() => {
    let id;
    const loop = () => {
      if (!isPaused) {
        setAngles((p) => p.map((a, i) => a + speeds[i] * timeScale));
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [isPaused, timeScale]);

  // 📷 CAMERA ZOOM
  useEffect(() => {
    const cam = document.querySelector("#camera");
    if (cam) cam.setAttribute("position", `0 1.6 ${5 - zoom * 1.8}`);
  }, [zoom]);

  // 🔊 SPEAK
  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // 🧠 FIXED VOICE ENGINE (IMPORTANT PART)
  const handleCommand = (text) => {
    const raw = text.toLowerCase().trim();
    console.log("HEARD:", raw);

    lastHeard.current = Date.now();

    // 🟢 WAKE WORD
    if (!awake) {
      if (raw.includes("hey galaxy")) {
        setAwake(true);
        speak("Galaxy activated");

        clearTimeout(wakeTimeout.current);
        wakeTimeout.current = setTimeout(() => {
          setAwake(false);
          speak("Galaxy sleeping");
        }, 20000); // 🔥 longer stability
      }
      return;
    }

    // 🪐 PLANET DETECTION (FIXED FLEXIBLE MATCH)
    const foundPlanet = names.find((p) => raw.includes(p.toLowerCase()));

    if (foundPlanet) {
      setInfo({ name: foundPlanet, ...planetData[foundPlanet] });
      speak(`${foundPlanet}. ${planetData[foundPlanet].desc}`);
      return;
    }

    // 🎮 COMMANDS (natural speech support)
    if (raw.includes("zoom in")) {
      setZoom((z) => Math.min(z + 0.5, 4));
      speak("Zooming in");
      return;
    }

    if (raw.includes("zoom out")) {
      setZoom((z) => Math.max(z - 0.5, 0.5));
      speak("Zooming out");
      return;
    }

    if (raw.includes("pause")) {
      setIsPaused(true);
      speak("Paused");
      return;
    }

    if (raw.includes("resume")) {
      setIsPaused(false);
      speak("Resumed");
      return;
    }

    speak("Command not recognized");
  };

  // 🎤 START VOICE
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript;
      handleCommand(text);
    };

    recognition.onerror = (e) => console.log("Voice error:", e.error);

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setAwake(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      {/* STATUS */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 9999,
          color: awake ? "#00ffcc" : "#aaa",
        }}
      >
        {listening ? (awake ? "🟢 GALAXY ACTIVE" : "🎤 Listening") : "⚫ OFF"}
      </div>

      {/* CONTROL PANEL */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 9999,
          width: 220,
          padding: 15,
          borderRadius: 15,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        <button onClick={() => (listening ? stopVoice() : startVoice())}>
          {listening ? "Stop Voice" : "Start Voice"}
        </button>

        <p>
          Say: <b>Hey Galaxy</b>
        </p>

        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
        </button>

        <p>Zoom</p>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(+e.target.value)}
        />
      </div>

      {/* INFO PANEL */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 300,
          padding: 15,
          borderRadius: 15,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          zIndex: 9999,
        }}
      >
        <h3>NASA INFO</h3>

        {info ? (
          <>
            <h2>{info.name}</h2>
            <p>{info.desc}</p>
          </>
        ) : (
          <p>Say “Hey Galaxy” then planet name</p>
        )}
      </div>

      {/* AR SCENE */}
      <a-scene
        embedded
        arjs="sourceType:webcam; debugUIEnabled:false"
        renderer="alpha:true"
        vr-mode-ui="enabled:false"
      >
        <a-light type="ambient" intensity="1.2" />
        <a-light type="point" intensity="2" />

        <a-marker preset="hiro">
          <a-entity>
            {/* SUN */}
            <a-sphere
              radius="0.6"
              material="src:/textures/sun.jpg; emissive:#ffaa00"
            />

            {/* PLANETS */}
            {names.map((name, i) => {
              const p = planetData[name];

              const x = distances[i] * Math.cos(angles[i]);
              const z = distances[i] * Math.sin(angles[i]);

              return (
                <a-entity key={name} position={`${x} 0.5 ${z}`}>
                  <a-text value={name} scale="0.4 0.4 0.4" look-at="#camera" />

                  <a-sphere radius={sizes[i]} material={`src:${p.texture};`} />
                </a-entity>
              );
            })}
          </a-entity>
        </a-marker>

        <a-entity id="camera" camera look-controls />
      </a-scene>
    </div>
  );
}

export default App;
