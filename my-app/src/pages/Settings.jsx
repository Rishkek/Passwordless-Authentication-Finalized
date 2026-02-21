import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Settings() {
  const { setTheme } = useContext(ThemeContext);

  return (
    <div>
      <h2>Theme</h2>
      <div className="theme-options">
        <button onClick={() => setTheme("dark")}>Void Dark</button>
        <button onClick={() => setTheme("green")}>Terminal Green</button>
        <button onClick={() => setTheme("amber")}>Amber</button>
        <button onClick={() => setTheme("light")}>Minimal Light</button>
      </div>
    </div>
  );
}

export default Settings;