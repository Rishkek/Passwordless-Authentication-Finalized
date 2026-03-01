import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("keyAuth_currentUser");
    setCurrentUser(null);
    navigate("/profile");
  };

  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-label">
            SECURE • UNIQUE • BEHAVIOURAL
          </div>

          <h1 className="hero-title">
            Behavioural
            <br />
            Authentication
          </h1>

          <div className="hero-divider" />

          <p className="hero-sub">
            Identity verified through keystroke dynamics.
            No friction. Just behavior.
          </p>

          <div className="hero-actions">

           


            <button className="logout-btn" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;