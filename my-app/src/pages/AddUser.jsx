import { useState } from "react";

const sentences = [
  "Security is an evolving discipline.",
  "Typing patterns are uniquely human.",
  "Authentication without passwords."
];

function AddUser() {
  const [step, setStep] = useState(1);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  return (
    <div>
      {step === 1 && (
        <>
          <h2>Create User</h2>
          <input placeholder="Full Name" />
          <button onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Training</h2>
          <p>{sentences[sentenceIndex]}</p>
          <textarea
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSentenceIndex((prev) =>
                  prev + 1 < sentences.length ? prev + 1 : 0
                );
              }
              if (e.ctrlKey && e.key === "q") {
                setStep(3);
              }
            }}
          />
          <p>Press Enter for next. Ctrl+Q to save.</p>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Training Complete</h2>
          <button>Save User</button>
        </>
      )}
    </div>
  );
}

export default AddUser;