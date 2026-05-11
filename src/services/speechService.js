export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function speak(text) {
  if (!window.speechSynthesis || !text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.05;
  utterance.rate = 0.95;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
