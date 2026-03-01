---

# 🛡️ **Passwordless Auth: Advanced Behavioral Keystroke Dynamics**

### *Moving beyond "What you know" to "How you behave."*

This repository hosts a sophisticated **Behavioral Biometric Authentication** system. While traditional passwords can be stolen, guessed, or intercepted, a human’s typing rhythm—the specific micro-temporal patterns of muscle memory—is a unique internal signature. This project leverages high-precision timing to verify identity without a single character of a password ever needing to be "secret."

---

## 🧠 **The Nine Pillars of Behavioral Analysis**

Our engine doesn't just look at speed; it analyzes the **spatial-temporal relationship** of every finger movement across these nine specialized metrics:

* **1. Key Identity:** The specific character value being interacted with. This allows the system to build a "finger-specific" profile (e.g., knowing your ring finger is slower than your index finger).
* **2. Key_Pair (Digrams):** The transition between two specific keys. The movement from 'E' to 'R' is physically different from 'P' to 'Q'. We map these unique "hand-paths."
* **3. Flight Up Time:** The duration between the release of the first key and the release of the second key. This measures the "follow-through" of your typing motion.
* **4. Flight Down Time:** The interval from the initial press of Key A to the initial press of Key B. This is the most consistent indicator of a user's mental "typing cadence."
* **5. Dwell Time (Hold Time):** The exact duration a key remains physically depressed. This highlights individual finger pressure and "stickiness" on specific keys.
* **6. Overlap (N-Key Rollover):** A hallmark of advanced typists. This measures the period where Key B is pressed while Key A is still being held down, capturing the "fluidity" of the movement.
* **7. Session WPM (Words Per Minute):** The macro-speed of the entire session. This acts as a global normalization factor to account for environmental changes (e.g., typing on a different keyboard).
* **8. Grid Distance Weighting:** A spatial logic layer. The system calculates the physical distance between keys on a QWERTY grid. A "long jump" (like 'Z' to 'P') is weighted differently than a "short jump" ('F' to 'G'), ensuring that slower speeds over long distances aren't flagged as anomalies.
* **9. Instant WPM (Burst Speed):** Localized speed calculated at the millisecond level between individual keys. It captures the "bursts" of speed that occur during familiar letter combinations like "ing" or "tion."

---

## ⚙️ **The Sequence of Events: System Architecture**

The authentication journey follows a highly optimized, four-stage pipeline:

### **Stage 1: The High-Precision Capture (React Frontend)**

The `my-app` interface acts as a "Digital Oscilloscope" for your keyboard. Using low-level JavaScript event hooks, it bypasses standard input lag to record timestamps with sub-millisecond precision. Every `keydown` and `keyup` is captured and bundled into a sequential data stream.

### **Stage 2: Feature Engineering & Orchestration (combinedpython.py)**

The raw data is transmitted to the Python backend. `combinedpython.py` serves as the **Logic Hub**. It iterates through the raw timestamps to derive the complex metrics like **Overlap** and **Flight Times**. It transforms a simple list of times into a multi-dimensional **Behavioral Vector**.

### **Stage 3: Statistical Comparison & Distance Scoring (user_detector.py)**

The **Classifier Engine** takes the live Behavioral Vector and compares it against the "Golden Profile" stored in the database.

* **Distance Metric:** It calculates the **Manhattan Distance** (the sum of absolute differences) between the live sample and the user's historical average.
* **Variance Logic:** The system doesn't look for a perfect match; it looks for a match within the user's unique **Standard Deviation** ($\sigma$).

### **Stage 4: The Decision & API Response (server.py)**

The Flask/FastAPI server acts as the final judge. If the distance score is below the security threshold, it issues a signed authentication token to the frontend, granting access. If the rhythm is inconsistent—even with the correct words—the attempt is logged as a "Behavioral Mismatch."

---

## 📂 **In-Depth Repository Breakdown**

* **`server.py` [The Bridge]:** The primary entry point for the API. It manages session states, handles CORS for the React app, and directs traffic between the web and the logic layers.
* **`combinedpython.py` [The Brain]:** The mathematical heart of the project. This is where the raw data is turned into intelligence by calculating the Overlap, Flight, and WPM parameters.
* **`user_detector.py` [The Sentry]:** The security layer. It applies the **Grid Distance** logic and performs the final mathematical verification to distinguish between the owner and an intruder.
* **`prerequisite.py` [The Coach]:** An enrollment utility. It guides the user through the process of "teaching" the system their rhythm by collecting multiple training samples.
* **`my-app/` [The Interface]:** A React-based application designed for minimal overhead to ensure the most accurate timing possible.
* **`UserData/` [The Vault]:** A protected directory containing the mathematical models (Mean and Variance) for every registered user.

---

## 🚀 **Deployment & Usage Guide**

1. **Requirement Installation:** Ensure your Python environment is ready by installing the dependencies listed in `requirements.txt`.
2. **User Enrollment:** Run `python prerequisite.py`. You will be asked to type a signature phrase (e.g., "The quick brown fox"). The system will record your rhythm 5–10 times to build your profile.
3. **Start the Backend:** Run `python server.py`. This opens the API port to listen for incoming authentication attempts.
4. **Start the Frontend:** Navigate to `my-app`, install node modules, and run `npm start`.
5. **Experience Passwordless Auth:** Type your phrase into the web UI. If your rhythm matches, you’re in!

---
