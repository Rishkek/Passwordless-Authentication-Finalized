# 🛡️ **Passwordless Auth: Behavioral Keystroke Dynamics**

### *Authenticating users by the rhythm of their soul, not just the content of their memory.*

This repository implements a cutting-edge **Behavioral Biometric** system. Instead of relying on vulnerable static passwords, it analyzes the unique physical interaction between a human and their keyboard—a signature that is nearly impossible to replicate, share, or steal.

---

## 🧠 **Core Biometric Parameters**

The engine processes every keystroke through **nine distinct layers** of temporal and spatial data to verify identity:

1. **Key:** The specific character value identified during the input event.
2. **Key_Pair:** The "Digram" sequence (e.g., the transition from 'G' to 'H'). Finger movement patterns between specific keys are highly individualistic.
3. **Flight Up Time:** The time elapsed between the release of the first key and the release of the second key.
4. **Flight Down Time:** The interval from the initial press of Key A to the initial press of Key B.
5. **Dwell Time:** The "Hold Time"—the exact duration a single key remains depressed.
6. **Overlap:** A critical metric for fluent typists; it measures the millisecond duration where Key B is pressed before Key A has been released.
7. **Session WPM:** The global average "Words Per Minute" calculated across the entire authentication attempt.
8. **Grid Distance:** The physical distance between keys on a standard QWERTY layout. This is used to "weight" the timing; a "long jump" across the keyboard is expected to have different timing than adjacent keys.
9. **Instant WPM:** The "Burst Speed"—the localized WPM calculated at the exact moment of a specific key transition, capturing micro-fluctuations in rhythm.

---

## ⚙️ **Sequence of Events (Execution Flow)**

The system operates in a high-speed pipeline to ensure authentication happens in near real-time:

### **1. Capture (React Frontend)**

The interface utilizes low-level event hooks to catch every press and release signal. It records high-resolution timestamps with millisecond precision and packages them into a temporal sequence for analysis.

### **2. Feature Extraction (combinedpython.py)**

The raw data is transmitted to the Python engine. Here, the timestamps are transformed into the **9 parameters** listed above. This component acts as the mathematical core, deriving the Overlap and Instant WPM values from the raw stream.

### **3. Classification (user_detector.py)**

The system calculates the **Grid Distance** and uses a mathematical similarity algorithm to compare the live typing sample against the authorized user's "Master Profile."

* **Verification:** If the timing variance is within the user's historical profile, identity is confirmed.
* **Mitigation:** If the timing is too mechanical (suggesting a bot) or too erratic (suggesting an intruder), access is denied.

---

## 📂 **Repository Components**

* **`server.py`** — **The API Gateway.** Manages the secure bridge between the web interface and the Python processing engine.
* **`combinedpython.py`** — **The Orchestrator.** The central logic unit that calculates complex parameters like Overlap, Flight Times, and WPM metrics.
* **`user_detector.py`** — **The Classifier.** The decision-making engine that applies weights based on Grid Distance and performs final identity verification.
* **`prerequisite.py`** — **The Enrollment Tool.** A specialized script used to train the system by recording a user's baseline typing signature.
* **`my-app/`** — **The Frontend.** A React-based application optimized for ultra-low latency keystroke tracking and user feedback.
* **`UserData/`** — **The Vault.** A secure directory used to store the mathematical behavioral models of registered users.

---

## 🚀 **Getting Started**

1. **Environment Setup:** Install the necessary libraries listed in the requirements file.
2. **Enroll Your Identity:** Use the enrollment tool to type your chosen phrase several times to build your unique behavioral profile.
3. **Launch the System:** Initialize the backend server followed by the frontend development environment.
4. **Authenticate:** Simply type your phrase into the UI; the system will recognize you by your rhythm.

---
