import { useState, useRef } from "react";
import "../Profile.css";

const sentencePool = [
  "the smallest details define the strongest locks",
  "behavior is harder to fake than passwords",
  "precision creates identity over time",
  "security should feel invisible",
  "typing rhythm reveals patterns",
  "consistency builds trust in systems",
  "every keystroke tells a story",
  "subtle timing differences matter",
  "biometrics improve authentication",
  "patterns strengthen verification",
  "identity lives in behavior",
  "machines learn from repetition",
  "secure systems reduce friction",
  "auth begins with movement"
];

const getRandomSentences = (count = 10) => {
  const shuffled = [...sentencePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function AddUser() {
  const [name, setName] = useState("");
  const [trainingMode, setTrainingMode] = useState(false);
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const keyDownTimes = useRef({});
  const lastKeyDownTime = useRef(null);
  const lastKeyUpTime = useRef(null);
  const previousKey = useRef("START");
  const keystrokeBuffer = useRef([]);


  const sessionStartTime = useRef(null);
  const allSessions = useRef([]);

  const handleTrain = () => {
    if (!name.trim()) return;

    setSentences(getRandomSentences(10));
    setCurrentIndex(0);
    setInputValue("");
    setTrainingMode(true);

    keystrokeBuffer.current = [];
    previousKey.current = "START";
    lastKeyDownTime.current = null;
    lastKeyUpTime.current = null;
    sessionStartTime.current = null;
    allSessions.current = [];
  };


  const handleKeyDown = (e) => {
    const now = performance.now() / 1000;

    if (!sessionStartTime.current) {
      sessionStartTime.current = now;
    }

    keyDownTimes.current[e.key] = now;

    const flightDD = lastKeyDownTime.current
      ? now - lastKeyDownTime.current
      : 0;

    const flightUD = lastKeyUpTime.current
      ? now - lastKeyUpTime.current
      : 0;


    const isOverlap =
      lastKeyUpTime.current && lastKeyUpTime.current > lastKeyDownTime.current
        ? 1
        : 0;

    keystrokeBuffer.current.push({
      Key: e.key,
      Key_Pair: `${previousKey.current}_${e.key}`,
      Flight_UD_s: flightUD,
      Flight_DD_s: flightDD,
      Is_Overlap: isOverlap
    });

    lastKeyDownTime.current = now;
  };


  const handleKeyUp = (e) => {
    const now = performance.now() / 1000;
    const keyDownTime = keyDownTimes.current[e.key];
    if (!keyDownTime) return;

    const dwell = now - keyDownTime;

    const lastEntry =
      keystrokeBuffer.current[keystrokeBuffer.current.length - 1];

    if (lastEntry) {
      lastEntry.Dwell_Time_s = dwell;
    }

    lastKeyUpTime.current = now;
    previousKey.current = e.key;
  };


  const calculateWPM = (typedText, startTime, endTime) => {
    if (!startTime) return 0;
    const minutes = (endTime - startTime) / 60;
    const words = typedText.length / 5;
    return minutes > 0 ? words / minutes : 0;
  };

  const calculateAccuracy = (typed, original) => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === original[i]) correct++;
    }
    return (correct / original.length) * 100;
  };

  const calculateAverages = (data) => {
    const valid = data.filter(k => k.Dwell_Time_s !== undefined);

    const mean = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      Mean_Dwell: mean(valid.map(k => k.Dwell_Time_s)),
      Mean_Flight_UD: mean(valid.map(k => k.Flight_UD_s)),
      Mean_Flight_DD: mean(valid.map(k => k.Flight_DD_s)),
      Overlap_Rate:
        valid.length
          ? valid.filter(k => k.Is_Overlap === 1).length / valid.length
          : 0,
      Burst_Pause_Count:
        valid.filter(k => k.Flight_UD_s > 0.3).length
    };
  };

  const handleNext = async () => {
    if (!inputValue.trim()) return;

    const endTime = performance.now() / 1000;

    const metrics = calculateAverages(keystrokeBuffer.current);

    const sentenceCapture = {
      sentence: sentences[currentIndex],
      keystrokes: keystrokeBuffer.current,
      WPM: calculateWPM(
        inputValue,
        sessionStartTime.current,
        endTime
      ),
      Accuracy: calculateAccuracy(
        inputValue,
        sentences[currentIndex]
      ),
      ...metrics
    };

    allSessions.current.push(sentenceCapture);

    keystrokeBuffer.current = [];
    previousKey.current = "START";
    lastKeyDownTime.current = null;
    lastKeyUpTime.current = null;
    sessionStartTime.current = null;

    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
    } else {
      try {
        setIsSubmitting(true);

        const response = await fetch("http://172.16.128.174:8000/train", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: name,
            sessions: allSessions.current
          })
        });

        if (!response.ok) {
          throw new Error("Backend error");
        }

        const data = await response.json();
        console.log("Backend response:", data);

        alert("Training complete & data sent successfully!");

      } catch (error) {
        console.error("Error sending data:", error);
        alert("Failed to send data to backend.");
        return;
      } finally {
        setIsSubmitting(false);
      }


      setTrainingMode(false);
      setName("");
      setSentences([]);
      setCurrentIndex(0);
      setInputValue("");
      allSessions.current = [];
    }
  };

  return (
    <div className="profile-container">
      {!trainingMode ? (
        <>
          <div className="profile-header">
            <span className="subtitle">// NEW PROFILE</span>
            <h1 className="title">Add User</h1>
          </div>

          <div className="training-wrapper">
            <div className="training-card">
              <div className="training-section">
                <div className="training-label">NAME</div>
                <input
                  type="text"
                  className="training-input"
                  placeholder="Full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <button
                className="training-btn"
                onClick={handleTrain}
                disabled={!name.trim()}
              >
                TRAIN DATASET →
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="profile-header">
            <span className="subtitle">// KEYSTROKE CAPTURE</span>
            <h1 className="title">Training — {name}</h1>
          </div>

          <div className="training-wrapper">
            <div className="training-card">

              <div className="training-section">
                <div className="training-label">TYPE THIS:</div>
                <div className="training-sentence">
                  {sentences[currentIndex]}
                </div>
              </div>

              <input
                type="text"
                className="training-input"
                placeholder="Start typing here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
              />

              <div className="session-counter">
                Session {currentIndex + 1} / 10
              </div>

              <button
                className="training-btn"
                onClick={handleNext}
                disabled={!inputValue.trim() || isSubmitting}
              >
                {isSubmitting
                  ? "SENDING..."
                  : currentIndex === 9
                  ? "FINISH"
                  : "NEXT"}
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddUser;