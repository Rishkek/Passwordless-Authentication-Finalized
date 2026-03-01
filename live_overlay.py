import tkinter as tk
import time
import pandas as pd
from pynput import keyboard
import collections
import os
import math
import joblib
import threading

# =======================================================
# DIRECTORY & MODEL SETUP
# =======================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DATA_DIR = os.path.join(BASE_DIR, "UserData", "ML_Data")
MODEL_FILE = os.path.join(ML_DATA_DIR, "advanced_keystroke_model.pkl")
COLS_FILE = os.path.join(ML_DATA_DIR, "model_columns.pkl")

print("Loading Machine Learning Core...")
try:
    rf_model = joblib.load(MODEL_FILE)
    training_columns = joblib.load(COLS_FILE)
    print("✅ ML Core Loaded Successfully!")
except FileNotFoundError:
    print("❌ Model not found! Run combinedpython.py first to train the AI.")
    exit()

# =======================================================
# BIOMETRICS & GRID MATH
# =======================================================
key_coords = {
    '`': (-1, -1), '~': (-1, -1), '1': (-1, 0), '!': (-1, 0), '2': (-1, 1), '@': (-1, 1), '3': (-1, 2), '#': (-1, 2),
    '4': (-1, 3), '$': (-1, 3), '5': (-1, 4), '%': (-1, 4), '6': (-1, 5), '^': (-1, 5), '7': (-1, 6), '&': (-1, 6),
    '8': (-1, 7), '*': (-1, 7), '9': (-1, 8), '(': (-1, 8), '0': (-1, 9), ')': (-1, 9), '-': (-1, 10), '_': (-1, 10),
    '=': (-1, 11), '+': (-1, 11),
    'q': (0, 0), 'w': (0, 1), 'e': (0, 2), 'r': (0, 3), 't': (0, 4), 'y': (0, 5), 'u': (0, 6), 'i': (0, 7), 'o': (0, 8),
    'p': (0, 9),
    '[': (0, 10), '{': (0, 10), ']': (0, 11), '}': (0, 11), '\\': (0, 12), '|': (0, 12),
    'a': (1, 0.5), 's': (1, 1.5), 'd': (1, 2.5), 'f': (1, 3.5), 'g': (1, 4.5), 'h': (1, 5.5), 'j': (1, 6.5),
    'k': (1, 7.5), 'l': (1, 8.5),
    ';': (1, 9.5), ':': (1, 9.5), '\'': (1, 10.5), '"': (1, 10.5),
    'z': (2, 0.7), 'x': (2, 1.7), 'c': (2, 2.7), 'v': (2, 3.7), 'b': (2, 4.7), 'n': (2, 5.7), 'm': (2, 6.7),
    ',': (2, 7.7), '<': (2, 7.7), '.': (2, 8.7), '>': (2, 8.7), '/': (2, 9.7), '?': (2, 9.7), ' ': (3, 4.5)
}


def calculate_grid_distance(key_pair):
    if pd.isna(key_pair) or key_pair == "START" or "_" not in str(key_pair): return 0.0
    try:
        k1, k2 = key_pair.split('_')
        k1, k2 = k1.lower(), k2.lower()
        if k1 in key_coords and k2 in key_coords:
            return round(math.dist(key_coords[k1], key_coords[k2]), 2)
    except:
        pass
    return 0.0


def get_key_name(key):
    try:
        return key.char
    except AttributeError:
        return str(key).replace("Key.", "<") + ">"


# =======================================================
# ROLLING TRACKER LOGIC
# =======================================================
active_keys = {}
last_release_time = 0.0
last_press_time = 0.0
last_key_pressed = ""

# The "Rolling Window" - only keeps the last 15 keystrokes
ROLLING_WINDOW_SIZE = 15
rolling_data = collections.deque(maxlen=ROLLING_WINDOW_SIZE)


def predict_user():
    """Takes the current rolling window and asks the AI who is typing."""
    if len(rolling_data) < 5:  # Not enough data yet
        return "Analyzing..."

    df = pd.DataFrame(list(rolling_data),
                      columns=["Key", "Key_Pair", "Flight_UD_s", "Flight_DD_s", "Dwell_Time_s", "Is_Overlap"])

    # Cast to numeric
    for col in ["Flight_UD_s", "Flight_DD_s", "Dwell_Time_s", "Is_Overlap"]:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # Inject Bio-Features
    df['Session_WPM'] = 60.0  # Placeholder for live rolling
    df['Grid_Distance'] = df['Key_Pair'].apply(calculate_grid_distance)
    df['Instant_WPM'] = 60 / (df['Flight_DD_s'].clip(lower=0.01) * 5)

    # Encode and predict
    df_encoded = pd.get_dummies(df)
    X_live = df_encoded.reindex(columns=training_columns, fill_value=0)

    predictions = rf_model.predict(X_live)
    predicted_user = collections.Counter(predictions).most_common(1)[0][0]
    return f"Active: User {predicted_user}"


def on_press(key):
    global last_release_time, last_press_time, last_key_pressed
    timestamp = time.time()
    key_name = get_key_name(key)
    if key_name == ',': return

    if key_name not in active_keys:
        flight_dd = (timestamp - last_press_time) if last_press_time else 0.0
        flight_ud = (timestamp - last_release_time) if last_release_time else 0.0
        is_overlap = 1 if (last_release_time == 0.0 or last_press_time > last_release_time) else 0
        key_pair = f"{last_key_pressed}_{key_name}" if last_key_pressed else "START"

        active_keys[key_name] = {'press_time': timestamp, 'flight_dd': flight_dd, 'flight_ud': flight_ud,
                                 'is_overlap': is_overlap, 'key_pair': key_pair}
        last_press_time = timestamp
        last_key_pressed = key_name


def on_release(key):
    global last_release_time
    release_time = time.time()
    key_name = get_key_name(key)
    if key_name == ',': return

    if key_name in active_keys:
        data = active_keys[key_name]
        dwell_time = release_time - data['press_time']

        # Append to the rolling buffer (automatically drops the oldest item if > 15)
        rolling_data.append(
            [key_name, data['key_pair'], data['flight_ud'], data['flight_dd'], dwell_time, data['is_overlap']])
        del active_keys[key_name]

        # Update the UI
        current_prediction = predict_user()
        ui_text.set(current_prediction)

    last_release_time = release_time


# =======================================================
# UI & MAIN THREAD
# =======================================================
# Setup Tkinter Overlay
root = tk.Tk()
root.title("Biometric Monitor")

# Make it borderless, always on top, and partially transparent
root.overrideredirect(True)
root.attributes("-topmost", True)
root.attributes("-alpha", 0.8)  # 80% opacity
root.configure(bg='black')

# Position at top right of the screen
screen_width = root.winfo_screenwidth()
window_width = 150
x_position = screen_width - window_width - 20  # 20px padding from the right edge
root.geometry(f"{window_width}x30+{x_position}+20")

# Setup text label
ui_text = tk.StringVar()
ui_text.set("Listening...")
label = tk.Label(root, textvariable=ui_text, fg="lime green", bg="black", font=("Consolas", 10, "bold"))
label.pack(expand=True)

# Start keyboard listener in a background thread so it doesn't freeze the UI
listener = keyboard.Listener(on_press=on_press, on_release=on_release)
listener.daemon = True
listener.start()

# Start the UI loop
try:
    root.mainloop()
except KeyboardInterrupt:
    listener.stop()