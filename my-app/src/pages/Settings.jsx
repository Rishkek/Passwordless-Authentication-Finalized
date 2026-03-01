import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import voidImg from "../assets/themes/void.jpg";
import greenImg from "../assets/themes/green.jpg";
import amberImg from "../assets/themes/amber.jpg";
import lightImg from "../assets/themes/light.jpg";

function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    { id: "void", label: "Void Dark", image: voidImg },
    { id: "green", label: "Terminal Green", image: greenImg },
    { id: "amber", label: "Amber", image: amberImg },
    { id: "light", label: "Minimal Light", image: lightImg },
  ];

  return (
    <div className="settings-wrapper">
      <div className="settings-card">
        <h2 className="settings-title">Appearance</h2>

        <div className="theme-grid">
          {themes.map((t) => (
            <div
              key={t.id}
              className={`theme-option ${theme === t.id ? "active" : ""}`}
              onClick={() => setTheme(t.id)}
              role="button"
            >
              <div
                className="theme-preview"
                style={{ backgroundImage: `url(${t.image})` }}
              />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;

