import React, { useState, useRef, useEffect, useCallback } from "react";
import ControlPanel from "./components/ControlPanel";
import PlanetFocus from "./components/PlanetFocus";
import planets from "./data/planets";
import "./App.css";

function App() {
  const [focusPlanet, setFocusPlanet] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [listening, setListening] = useState(false);
  const [awake, setAwake] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [markerFound, setMarkerFound] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const awakeRef = useRef(false);
  const transcriptTimer = useRef(null);
  const controlRef = useRef(null);

  useEffect(() => {
    awakeRef.current = awake;
  }, [awake]);

  // ── Listen for planet clicks dispatched from vanilla JS in index.html ──
  useEffect(() => {
    const handler = (e) => {
      const name = e.detail?.name;
      if (name && planets[name]) {
        setFocusPlanet({ name, ...planets[name] });
      }
    };
    window.addEventListener("planet-clicked", handler);
    return () => window.removeEventListener("planet-clicked", handler);
  }, []);

  // ── Listen for AR marker found/lost ──
  useEffect(() => {
    const onFound = () => setMarkerFound(true);
    const onLost = () => setMarkerFound(false);
    const marker = document.querySelector("#hiro-marker");
    if (marker) {
      marker.addEventListener("markerFound", onFound);
      marker.addEventListener("markerLost", onLost);
      return () => {
        marker.removeEventListener("markerFound", onFound);
        marker.removeEventListener("markerLost", onLost);
      };
    }
    // retry after A-Frame loads
    const t = setTimeout(() => {
      const m = document.querySelector("#hiro-marker");
      if (m) {
        m.addEventListener("markerFound", onFound);
        m.addEventListener("markerLost", onLost);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // ── Sync pause to vanilla orbit animation ──
  useEffect(() => {
    if (window.__galaxyAR) window.__galaxyAR.setPaused(isPaused);
  }, [isPaused]);

  const showTranscript = (text) => {
    setTranscript(text);
    clearTimeout(transcriptTimer.current);
    transcriptTimer.current = setTimeout(() => setTranscript(""), 3000);
  };

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 1.05;
    u.rate = 0.95;
    u.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const handleCommand = useRef((text) => {
    const raw = text.toLowerCase();
    showTranscript(`"${text}"`);

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

    const foundKey = Object.keys(planets).find((p) =>
      raw.includes(p.toLowerCase()),
    );

    if (raw.includes("how many moons") && foundKey) {
      speak(`${foundKey} has ${planets[foundKey].moons} moons.`);
      return;
    }
    if (raw.includes("temperature") && foundKey) {
      speak(`${foundKey} temperature: ${planets[foundKey].temperature}.`);
      return;
    }
    if (raw.includes("gravity") && foundKey) {
      speak(`${foundKey} gravity: ${planets[foundKey].gravity}.`);
      return;
    }
    if (raw.includes("atmosphere") && foundKey) {
      speak(`${foundKey} atmosphere: ${planets[foundKey].atmosphere}.`);
      return;
    }
    if (raw.includes("diameter") && foundKey) {
      speak(`${foundKey} diameter: ${planets[foundKey].diameter}.`);
      return;
    }
    if (raw.includes("fun fact") && foundKey) {
      speak(`Fun fact: ${planets[foundKey].funFact}`);
      return;
    }

    if (foundKey) {
      setFocusPlanet({ name: foundKey, ...planets[foundKey] });
      speak(`${foundKey}. ${planets[foundKey].desc}`);
      return;
    }

    if (raw.includes("pause")) {
      setIsPaused(true);
      speak("Solar system paused.");
      return;
    }
    if (raw.includes("resume")) {
      setIsPaused(false);
      speak("Solar system resumed.");
      return;
    }
    if (raw.includes("sleep") || raw.includes("goodbye")) {
      awakeRef.current = false;
      setAwake(false);
      speak("Galaxy sleeping. Say hey galaxy to wake me.");
      return;
    }

    speak("Command not recognized. Try saying a planet name.");
  });

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Please use Google Chrome for voice support.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    const r = new SR();
    r.continuous = true;
    r.lang = "en-US";
    r.interimResults = false;
    isListeningRef.current = true;
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal)
          handleCommand.current(e.results[i][0].transcript);
      }
    };
    r.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "audio-capture") r.stop();
    };
    r.onend = () => {
      if (isListeningRef.current)
        setTimeout(() => {
          try {
            r.start();
          } catch {}
        }, 200);
    };
    r.start();
    recognitionRef.current = r;
    setListening(true);
    speak("Galaxy voice online. Say hey galaxy to activate.");
  };

  const stopVoice = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    awakeRef.current = false;
    setAwake(false);
    speak("Voice offline.");
  };

  useEffect(() => {
    startVoice();
    return () => {
      isListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  // Measure control panel height
  useEffect(() => {
    const update = () => {
      if (controlRef.current) {
        document.documentElement.style.setProperty(
          "--control-h",
          controlRef.current.offsetHeight + "px",
        );
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (controlRef.current) ro.observe(controlRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Planet focus overlay — full screen, replaces HUD */}
      {focusPlanet && (
        <PlanetFocus
          planet={focusPlanet}
          onClose={() => setFocusPlanet(null)}
        />
      )}

      {/* HUD — always visible unless focus is open */}
      {!focusPlanet && (
        <div className="hud-layer">
          <ControlPanel
            ref={controlRef}
            listening={listening}
            startVoice={startVoice}
            stopVoice={stopVoice}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />

          {/* Marker status hint */}
          <div className="status-pill">
            {markerFound
              ? "🟢 Marker detected — tap a planet"
              : listening
                ? awake
                  ? "🟢 GALAXY ACTIVE"
                  : "🟡 Say: Hey Galaxy"
                : "⚫ OFFLINE"}
          </div>

          {/* Tap hint when no marker */}
          {!markerFound && (
            <div className="marker-hint">
              📷 Point camera at <strong>HIRO</strong> marker to see the solar
              system
            </div>
          )}

          {transcript && (
            <div className="transcript-toast">🎙 {transcript}</div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
