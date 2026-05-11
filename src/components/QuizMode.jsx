import React, { useState } from "react";

const QUESTIONS = [
  {
    question: "Which planet is called the Red Planet?",
    options: ["Mars", "Venus", "Jupiter"],
    answer: "Mars",
  },
  {
    question: "Which planet has the most famous ring system?",
    options: ["Earth", "Saturn", "Mercury"],
    answer: "Saturn",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Mercury", "Mars", "Neptune"],
    answer: "Mercury",
  },
  {
    question: "Which planet is the largest in the Solar System?",
    options: ["Jupiter", "Earth", "Uranus"],
    answer: "Jupiter",
  },
  {
    question: "Which planet is our home?",
    options: ["Venus", "Earth", "Saturn"],
    answer: "Earth",
  },
];

function QuizMode({ onClose, speak }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const current = QUESTIONS[index];
  const finished = index >= QUESTIONS.length;

  const choose = (option) => {
    if (selected || !current) return;

    setSelected(option);

    const correct = option === current.answer;

    if (correct) {
      setScore((value) => value + 1);
      speak?.("Correct.");
    } else {
      speak?.(`Incorrect. The correct answer is ${current.answer}.`);
    }
  };

  const next = () => {
    setSelected(null);
    setIndex((value) => value + 1);
  };

  return (
    <div className="quiz-overlay">
      <div className="quiz-panel">
        <button className="quiz-close" onClick={onClose}>
          ×
        </button>

        <div className="quiz-kicker">GALAXY QUIZ</div>

        {!finished ? (
          <>
            <div className="quiz-progress">
              Question {index + 1} of {QUESTIONS.length}
            </div>

            <h2>{current.question}</h2>

            <div className="quiz-options">
              {current.options.map((option) => {
                const isCorrect = selected && option === current.answer;
                const isWrong =
                  selected === option && option !== current.answer;

                return (
                  <button
                    key={option}
                    className={[
                      "quiz-option",
                      isCorrect ? "correct" : "",
                      isWrong ? "wrong" : "",
                    ].join(" ")}
                    onClick={() => choose(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="quiz-result">
                {selected === current.answer
                  ? "✅ Correct!"
                  : `❌ Correct answer: ${current.answer}`}

                <button className="quiz-next" onClick={next}>
                  {index === QUESTIONS.length - 1 ? "See Score" : "Next"}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Quiz Complete!</h2>
            <p className="quiz-score">
              You scored <strong>{score}</strong> out of{" "}
              <strong>{QUESTIONS.length}</strong>.
            </p>

            <button
              className="quiz-next"
              onClick={() => {
                setIndex(0);
                setScore(0);
                setSelected(null);
              }}
            >
              Restart Quiz
            </button>

            <button className="quiz-secondary" onClick={onClose}>
              Back to GalaxyAR
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizMode;
