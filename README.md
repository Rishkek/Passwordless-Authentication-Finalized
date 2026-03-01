🛡️ Passwordless Auth: Keystroke Dynamics & Behavioral Biometrics
This repository contains a specialized authentication engine that uses Behavioral Biometrics to verify identity. Instead of a static password, it analyzes the unique timing and rhythm—the "DNA of typing"—of a user.

📊 Technical Parameters & Metrics
The system analyzes every keystroke through the lens of nine specific metrics to build a high-fidelity behavioral profile:

Key: The ASCII/Unicode value of the specific character pressed.

Key_Pair: The "Digram" (combination of two keys, e.g., 'T' followed by 'H'). This is crucial because transitions between specific finger pairs are highly unique.

Flight Up Time: The time elapsed from releasing Key A to releasing Key B.

Flight Down Time: The time elapsed from pressing Key A to pressing Key B.

Dwell Time: The "Hold Time"—how long a single key remains depressed (T 
release
​	
 −T 
press
​	
 ).

Overlap: The specific duration where Key B is pressed before Key A is released. High overlap is a signature of proficient, fluent typists.

Session WPM: The average typing speed (Words Per Minute) across the entire authentication attempt.

Grid Distance: A spatial metric representing the physical distance between keys on a standard QWERTY layout, used to weigh the timing data.

Instant WPM: The "burst speed"—the calculated WPM at the exact moment of a specific key transition, capturing micro-fluctuations in rhythm.

⚙️ Sequence of Events (Execution Flow)
The authentication process follows a strict linear pipeline to ensure data integrity:

Step 1: Event Hooking (React)

As the user types, the my-app frontend uses low-level JavaScript event listeners (onKeyDown and onKeyUp). It records high-precision timestamps (performance.now) and bundles them into a temporal sequence.

Step 2: Payload Transmission

The React app sends a POST request containing the raw sequence to server.py.

Step 3: Feature Extraction (combinedpython.py)

The Python backend processes the raw timestamps to calculate the nine parameters listed above. It transforms raw time into a "Feature Vector"—a mathematical representation of that specific typing session.

Step 4: Profile Comparison (user_detector.py)

The system performs a Manhattan Distance calculation between the current session's Feature Vector and the "Master Profile" stored in UserData/.

Step 5: Decision Logic

Validation: If the variance is within the user's historical standard deviation (σ), an authentication token is issued.

Rejection: If the timing is too mechanical (suggesting a script) or too erratic (suggesting an intruder), access is denied.

📂 Repository Components
server.py The API Gateway. It serves as the bridge between the web interface and the Python processing engine.

combinedpython.py The Core Engine. This script calculates the complex parameters like Overlap, Flight Times, and Instant WPM.

user_detector.py The Classifier. It contains the logic for Grid Distance weighting and final identity verification.

prerequisite.py The Enrollment Tool. Used to train the system on a new user's typing behavior to establish a baseline.

UserData/ The Secure Vault. Stores the mathematical models of authorized users.

my-app/ The React UI. A clean interface designed to capture keystrokes without adding input latency.

🚀 How to Run
Install requirements: pip install -r requirements.txt

Enroll your pattern: python prerequisite.py (Follow the prompts to type your signature phrase).

Start the Backend: python server.py

Start the Frontend: cd my-app && npm start
