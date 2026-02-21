import { useState } from "react";

function Profile() {
  const [tab, setTab] = useState("login");

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTab("login")}>Login</button>
        <button onClick={() => setTab("signup")}>Signup</button>
      </div>

      {tab === "login" ? (
        <form className="form">
          <input placeholder="Email" />
          <input placeholder="Username" />
          <button>Login</button>
        </form>
      ) : (
        <form className="form">
          <input placeholder="Email" />
          <input placeholder="Username" />
          <button>Create Account</button>
        </form>
      )}
    </div>
  );
}

export default Profile;