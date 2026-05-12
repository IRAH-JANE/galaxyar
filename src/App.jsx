import React, { useCallback, useEffect, useRef, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PlanetFocus from "./components/PlanetFocus";
import QuizMode from "./components/QuizMode";
import VoiceAnswerBox from "./components/VoiceAnswerBox";
import planets from "./data/planets";
import {
  findPlanetName,
  getFactAnswer,
  hasWakeWord,
  normalizeSpeech,
  stripWakeWords,
} from "./services/commandParser";
import {
  getSpeechRecognition,
  speak as speakText,
} from "./services/speechService";
import "./App.css";

function App() {
  const [focusPlanet, setFocusPlanet] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [voiceAnswer, setVoiceAnswer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [listening, setListening] = useState(false);
  const [awake, setAwake] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [markerFound, setMarkerFound] = useState(false);
  const [spaceMode, setSpaceMode] = useState("hiro");

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const awakeRef = useRef(false);
  const transcriptTimer = useRef(null);
  const answerTimer = useRef(null);
  const controlRef = useRef(null);
  const handleCommandRef = useRef(null);

  useEffect(() => {
    awakeRef.current = awake;
  }, [awake]);

  const speak = useCallback((text) => {
    speakText(text);
  }, []);

  const showTranscript = useCallback((text) => {
    setTranscript(text);
    clearTimeout(transcriptTimer.current);
    transcriptTimer.current = setTimeout(() => setTranscript(""), 3500);
  }, []);

  const showVoiceAnswer = useCallback(
    (answer) => {
      setFocusPlanet(null);
      setQuizOpen(false);
      setVoiceAnswer(answer);

      clearTimeout(answerTimer.current);
      answerTimer.current = setTimeout(() => setVoiceAnswer(null), 10000);

      speak(answer.body);
    },
    [speak],
  );

  const openPlanet = useCallback(
    (name) => {
      if (!planets[name]) return;

      setQuizOpen(false);
      setVoiceAnswer(null);
      setFocusPlanet({ name, ...planets[name] });
      speak(`${name}. ${planets[name].desc}`);
    },
    [speak],
  );

  const closePlanet = useCallback(() => {
    setFocusPlanet(null);
  }, []);

  const showGalaxy = useCallback(() => {
    setFocusPlanet(null);
    setQuizOpen(false);
    setVoiceAnswer(null);
    setSpaceMode("galaxy");

    if (window.__galaxyAR?.showGalaxy) {
      window.__galaxyAR.showGalaxy();
    } else {
      setTimeout(() => window.__galaxyAR?.showGalaxy?.(), 300);
    }

    speak("Showing the Milky Way galaxy.");
  }, [speak]);

  const showSolarSystem = useCallback(() => {
    setFocusPlanet(null);
    setQuizOpen(false);
    setVoiceAnswer(null);
    setSpaceMode("solar");

    if (window.__galaxyAR?.showSolar) {
      window.__galaxyAR.showSolar();
    } else {
      setTimeout(() => window.__galaxyAR?.showSolar?.(), 300);
    }

    speak("Showing the solar system.");
  }, [speak]);

  const useHiroMode = useCallback(() => {
    setSpaceMode("hiro");
    window.__galaxyAR?.useHiro?.();
    speak("Returning to HIRO marker AR mode.");
  }, [speak]);

  const openPlanetScanner = useCallback(() => {
    setFocusPlanet(null);
    setQuizOpen(false);
    setVoiceAnswer(null);
    window.location.href = "/planet-scanner.html";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planetFromScanner = params.get("planet");

    if (planetFromScanner && planets[planetFromScanner]) {
      openPlanet(planetFromScanner);

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [openPlanet]);

  const openQuiz = useCallback(() => {
    setFocusPlanet(null);
    setVoiceAnswer(null);
    setQuizOpen(true);
    speak("Starting Galaxy Quiz.");
  }, [speak]);

  useEffect(() => {
    const handler = (event) => {
      const name = event.detail?.name;

      if (name) openPlanet(name);
    };

    window.addEventListener("planet-clicked", handler);
    return () => window.removeEventListener("planet-clicked", handler);
  }, [openPlanet]);

  useEffect(() => {
    const onFound = () => {
      setMarkerFound(true);
      setSpaceMode("hiro");
    };
    const onLost = () => setMarkerFound(false);
    const onMode = (event) => setSpaceMode(event.detail?.mode || "hiro");

    window.addEventListener("marker-found", onFound);
    window.addEventListener("marker-lost", onLost);
    window.addEventListener("galaxy-mode-changed", onMode);

    const marker = document.querySelector("#hiro-marker");
    marker?.addEventListener("markerFound", onFound);
    marker?.addEventListener("markerLost", onLost);

    return () => {
      window.removeEventListener("marker-found", onFound);
      window.removeEventListener("marker-lost", onLost);
      window.removeEventListener("galaxy-mode-changed", onMode);
      marker?.removeEventListener("markerFound", onFound);
      marker?.removeEventListener("markerLost", onLost);
    };
  }, []);

  useEffect(() => {
    window.__galaxyAR?.setPaused?.(isPaused);
  }, [isPaused]);

  useEffect(() => {
    const modalOpen = Boolean(focusPlanet || quizOpen);

    document.body.classList.toggle("modal-open", modalOpen);
    window.__galaxyAR?.setModalOpen?.(modalOpen);

    return () => {
      document.body.classList.remove("modal-open");
      window.__galaxyAR?.setModalOpen?.(false);
    };
  }, [focusPlanet, quizOpen]);

  const handleCommand = useCallback(
    (text) => {
      const original = text.trim();
      let raw = normalizeSpeech(original);

      if (!raw) return;

      showTranscript(`"${original}"`);

      console.log("[GalaxyAR voice]", raw);

      if (!awakeRef.current) {
        if (!hasWakeWord(raw)) return;

        awakeRef.current = true;
        setAwake(true);

        raw = stripWakeWords(raw);

        if (!raw) {
          speak("Galaxy activated. I'm listening.");
          return;
        }
      } else {
        raw = stripWakeWords(raw);
      }

      const wantsGalaxy =
        raw.includes("milky way") ||
        raw.includes("galaxy view") ||
        raw === "galaxy" ||
        raw.includes("show galaxy") ||
        raw.includes("show the galaxy") ||
        raw.includes("open galaxy") ||
        raw.includes("display galaxy");

      if (wantsGalaxy) {
        showGalaxy();
        return;
      }

      const wantsSolar =
        raw.includes("solar system") ||
        raw.includes("solar view") ||
        raw.includes("show solar") ||
        raw.includes("show the solar") ||
        raw.includes("show planets") ||
        raw.includes("back to planets") ||
        raw.includes("back to solar");

      if (wantsSolar) {
        showSolarSystem();
        return;
      }

      const wantsScanner =
        raw.includes("scan planet") ||
        raw.includes("planet scanner") ||
        raw.includes("scan earth") ||
        raw.includes("image scanner") ||
        raw.includes("detect planet");

      if (wantsScanner) {
        speak("Opening planet scanner.");
        window.location.href = "/planet-scanner.html";
        return;
      }

      if (
        raw.includes("hiro") ||
        raw.includes("marker mode") ||
        raw.includes("ar mode")
      ) {
        useHiroMode();
        return;
      }

      if (raw.includes("quiz")) {
        openQuiz();
        return;
      }

      if (raw.includes("pause")) {
        setIsPaused(true);
        speak("Solar system paused.");
        return;
      }

      if (raw.includes("resume") || raw.includes("continue")) {
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

      const planetName = findPlanetName(raw);

      if (planetName) {
        const factAnswer = getFactAnswer(raw, planetName, planets);

        if (factAnswer) {
          showVoiceAnswer(factAnswer);
          return;
        }

        openPlanet(planetName);
        return;
      }

      speak(
        "Command not recognized. Try saying show galaxy, show solar system, quiz mode, or a planet name.",
      );
    },
    [
      openPlanet,
      openQuiz,
      showGalaxy,
      showSolarSystem,
      showTranscript,
      showVoiceAnswer,
      speak,
      useHiroMode,
    ],
  );

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  }, [handleCommand]);

  const startVoice = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      alert("Please use Google Chrome for voice support.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    recognition.lang = "en-US";

    isListeningRef.current = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];

        if (!result.isFinal) continue;

        const alternatives = Array.from(result);
        const best =
          alternatives.sort(
            (a, b) => (b.confidence || 0) - (a.confidence || 0),
          )[0] || result[0];

        handleCommandRef.current?.(best.transcript);
      }
    };

    recognition.onerror = (event) => {
      console.warn("[GalaxyAR voice error]", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        isListeningRef.current = false;
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (!isListeningRef.current) return;

      setTimeout(() => {
        try {
          recognition.start();
        } catch {
          // Chrome throws if start is called while recognition is already restarting.
        }
      }, 650);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
      speak("Galaxy voice online. Say hey galaxy to activate.");
    } catch {
      // Already started.
    }
  }, [speak]);

  const stopVoice = useCallback(() => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    setListening(false);
    setAwake(false);
    awakeRef.current = false;

    speak("Voice offline.");
  }, [speak]);

  useEffect(() => {
    return () => {
      clearTimeout(transcriptTimer.current);
      clearTimeout(answerTimer.current);
      isListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!controlRef.current) return;

      document.documentElement.style.setProperty(
        "--control-h",
        `${controlRef.current.offsetHeight}px`,
      );
    };

    update();

    const observer = new ResizeObserver(update);

    if (controlRef.current) observer.observe(controlRef.current);

    return () => observer.disconnect();
  }, [voiceAnswer, listening, awake]);

  const statusText = (() => {
    if (spaceMode === "galaxy") return "🌌 Galaxy View";
    if (spaceMode === "solar") return "🪐 Free Solar View";
    if (markerFound) return "🟢 Marker detected — scroll to zoom, tap a planet";
    if (listening) return awake ? "🟢 GALAXY ACTIVE" : "🟡 Say: Hey Galaxy";
    return "⚫ OFFLINE";
  })();

  return (
    <>
      {focusPlanet && (
        <PlanetFocus planet={focusPlanet} onClose={closePlanet} />
      )}

      {quizOpen && (
        <QuizMode onClose={() => setQuizOpen(false)} speak={speak} />
      )}

      {!focusPlanet && !quizOpen && (
        <div className="hud-layer">
          <ControlPanel
            ref={controlRef}
            listening={listening}
            startVoice={startVoice}
            stopVoice={stopVoice}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            onShowGalaxy={showGalaxy}
            onShowSolar={showSolarSystem}
            onUseHiro={useHiroMode}
            onOpenScanner={openPlanetScanner}
            onOpenQuiz={openQuiz}
          />

          <VoiceAnswerBox
            answer={voiceAnswer}
            onClear={() => setVoiceAnswer(null)}
          />

          <div className="status-pill">{statusText}</div>

          {(markerFound || spaceMode === "solar") && (
            <div className="interaction-tip">
              Tap a planet to explore it — swipe/wheel to zoom in.
            </div>
          )}

          {!markerFound && spaceMode === "hiro" && (
            <div className="marker-hint">
              📷 Point camera at <strong>HIRO</strong> marker, or say{" "}
              <strong>“Hey Galaxy, show solar system”</strong>
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
