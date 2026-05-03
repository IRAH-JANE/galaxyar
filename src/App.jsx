import React, { useState, useRef, useEffect } from "react";
import ARScene from "./components/ARScene";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import planets from "./data/planets";
import "./App.css";

function App() {
  const [info, setInfo] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [listening, setListening] = useState(false);
  const [awake, setAwake] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // ✅ FIX: Use refs so handleCommand always reads latest values
  const awakeRef = useRef(false);
  const zoomRef = useRef(1);
  const isPausedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    awakeRef.current = awake;
  }, [awake]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // =========================
  // SPEAK FUNCTION
  // =========================
  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 1.05;
    u.rate = 0.95;
    u.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // =========================
  // COMMAND HANDLER (uses refs — always fresh values)
  // =========================
  const handleCommand = useRef((text) => {
    const raw = text.toLowerCase();
    console.log("HEARD:", raw);

    // =========================
    // WAKE WORD
    // =========================
    if (!awakeRef.current) {
      if (
        raw.includes("hey galaxy") ||
        raw.includes("okay galaxy") ||
        raw.includes("hey galax") ||
        raw.includes("galaxy")
      ) {
        awakeRef.current = true;
        setAwake(true);
        speak("Galaxy activated. I'm listening.");
      }
      return;
    }

    // =========================
    // FIND PLANET
    // =========================
    const foundPlanet = Object.keys(planets).find((p) =>
      raw.includes(p.toLowerCase()),
    );

    // =========================
    // SMART QUESTIONS
    // =========================
    if (raw.includes("how many moons") && foundPlanet) {
      speak(`${foundPlanet} has ${planets[foundPlanet].moons} moons.`);
      return;
    }

    if (raw.includes("temperature") && foundPlanet) {
      speak(
        `${foundPlanet} has a temperature of ${planets[foundPlanet].temperature}.`,
      );
      return;
    }

    if (raw.includes("gravity") && foundPlanet) {
      speak(`${foundPlanet} has a gravity of ${planets[foundPlanet].gravity}.`);
      return;
    }

    if (raw.includes("atmosphere") && foundPlanet) {
      speak(
        `${foundPlanet} has an atmosphere of ${planets[foundPlanet].atmosphere}.`,
      );
      return;
    }

    if (raw.includes("diameter") && foundPlanet) {
      speak(
        `${foundPlanet} has a diameter of ${planets[foundPlanet].diameter}.`,
      );
      return;
    }

    if (raw.includes("fun fact") && foundPlanet) {
      speak(`Fun fact about ${foundPlanet}: ${planets[foundPlanet].funFact}`);
      return;
    }

    // =========================
    // PLANET SELECT
    // =========================
    if (foundPlanet) {
      setInfo({ name: foundPlanet, ...planets[foundPlanet] });
      speak(`${foundPlanet}. ${planets[foundPlanet].desc}`);
      return;
    }

    // =========================
    // ZOOM
    // =========================
    if (raw.includes("zoom in")) {
      const next = Math.min(zoomRef.current + 0.5, 4);
      zoomRef.current = next;
      setZoom(next);
      speak("Zooming in");
      return;
    }

    if (raw.includes("zoom out")) {
      const next = Math.max(zoomRef.current - 0.5, 0.5);
      zoomRef.current = next;
      setZoom(next);
      speak("Zooming out");
      return;
    }

    // =========================
    // PAUSE / RESUME
    // =========================
    if (raw.includes("pause")) {
      isPausedRef.current = true;
      setIsPaused(true);
      speak("Solar system paused");
      return;
    }

    if (raw.includes("resume")) {
      isPausedRef.current = false;
      setIsPaused(false);
      speak("Solar system resumed");
      return;
    }

    // =========================
    // SLEEP
    // =========================
    if (raw.includes("sleep") || raw.includes("goodbye")) {
      awakeRef.current = false;
      setAwake(false);
      speak("Galaxy entering sleep mode. Say hey galaxy to wake me up.");
      return;
    }

    speak("Command not recognized. Try saying a planet name or zoom in.");
  });

  // =========================
  // START VOICE (ALWAYS LISTENING)
  // =========================
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Google Chrome.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false; // ✅ Only fire on final results to avoid duplicate triggers

    isListeningRef.current = true;

    recognition.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const text = e.results[i][0].transcript;
          handleCommand.current(text);
        }
      }
    };

    recognition.onerror = (e) => {
      console.log("Speech error:", e.error);
      if (e.error === "no-speech" || e.error === "audio-capture") {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.log("Restart err:", err);
          }
        }, 200);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;

    setListening(true);
    speak("Galaxy voice system online. Say hey galaxy to activate.");
  };

  // =========================
  // STOP VOICE
  // =========================
  const stopVoice = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    awakeRef.current = false;
    setAwake(false);
    speak("Voice system offline.");
  };

  // =========================
  // AUTO START
  // =========================
  useEffect(() => {
    startVoice();
    return () => {
      isListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  // =========================
  // Measure control panel height so info panel
  // can sit directly below it using a CSS var
  // =========================
  const controlRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (controlRef.current) {
        const h = controlRef.current.offsetHeight;
        document.documentElement.style.setProperty("--control-h", h + "px");
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (controlRef.current) ro.observe(controlRef.current);
    return () => ro.disconnect();
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="app-container">
      <ControlPanel
        ref={controlRef}
        listening={listening}
        startVoice={startVoice}
        stopVoice={stopVoice}
        zoom={zoom}
        setZoom={setZoom}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />

      <InfoPanel info={info} />

      <div className="status-indicator">
        {listening
          ? awake
            ? "🟢 GALAXY ACTIVE"
            : "🟡 LISTENING — Say: Hey Galaxy"
          : "⚫ OFFLINE"}
      </div>

      <ARScene planets={planets} zoom={zoom} isPaused={isPaused} />
    </div>
  );
}

export default App;
