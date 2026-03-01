import { useState } from "react";
import "../Profile.css";

function Profile({ currentUser, setCurrentUser }) {
  const [tab, setTab] = useState("signup");
  const [error, setError] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");


  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!signupEmail || !signupPassword) {
      setError("Please fill out all fields.");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("keyAuth_users")) || [];

    if (existingUsers.find((u) => u.email === signupEmail)) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = { email: signupEmail, password: signupPassword };

    existingUsers.push(newUser);
    localStorage.setItem("keyAuth_users", JSON.stringify(existingUsers));
    localStorage.setItem("keyAuth_currentUser", JSON.stringify(newUser));

    setCurrentUser(newUser);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const existingUsers =
      JSON.parse(localStorage.getItem("keyAuth_users")) || [];

    const foundUser = existingUsers.find(
      (u) =>
        u.email === loginIdentifier &&
        u.password === loginPassword
    );

    if (foundUser) {
      localStorage.setItem(
        "keyAuth_currentUser",
        JSON.stringify(foundUser)
      );
      setCurrentUser(foundUser); 
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <span className="subtitle">// SECURE ACCESS</span>
        <h1 className="title">Profile</h1>
      </div>

      <div className="auth-wrapper">
        <div className="tabs">
          <button
            className={`tab-btn ${tab === "signup" ? "active" : ""}`}
            onClick={() => {
              setTab("signup");
              setError("");
            }}
          >
            SIGNUP
          </button>

          <button
            className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            LOGIN
          </button>
        </div>

        <div className="form-box">
          {error && <div className="error-message">{error}</div>}

          {tab === "login" ? (
            <form className="form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>USERNAME OR EMAIL</label>
                <input
                  type="text"
                  placeholder="user@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <svg
                    className="password-eye"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    onClick={() =>
                      setShowLoginPassword(!showLoginPassword)
                    }
                  >
                    {showLoginPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                LOGIN
              </button>


              <p className="helper-text">
                Uses keystroke-dynamics if training data exists.
              </p>
            </form>
          ) : (
            <form className="form" onSubmit={handleSignup}>
              <div className="input-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>CREATE PASSWORD</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <svg
                    className="password-eye"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    onClick={() =>
                      setShowSignupPassword(!showSignupPassword)
                    }
                  >
                    {showSignupPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                CREATE ACCOUNT
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;