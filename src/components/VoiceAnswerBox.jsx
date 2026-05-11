import React from "react";

function VoiceAnswerBox({ answer, onClear }) {
  if (!answer) return null;

  return (
    <div className="voice-answer-card">
      <div className="voice-answer-top">
        <span className="voice-answer-label">VOICE ANSWER</span>
        <button className="voice-answer-close" onClick={onClear}>
          ×
        </button>
      </div>

      <h3>{answer.title}</h3>
      <p>{answer.body}</p>
    </div>
  );
}

export default VoiceAnswerBox;
