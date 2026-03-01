import { NavLink } from "react-router-dom";

function Sidebar({ currentUser }) {
  if (!currentUser) return null;

  return (
    <aside className="sidebar">


      <div className="logo">
        <svg
          className="logo-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>TYPEAUTH</span>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav className="sidebar-nav">


        <NavLink to="/home" end>
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </span>
          <span>Home</span>
        </NavLink>


        <NavLink to="/add-user">
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="8" r="4" />
              <path d="M17 11v6" />
              <path d="M20 14h-6" />
              <path d="M3 21v-2a6 6 0 0 1 6-6" />
            </svg>
          </span>
          <span>Add User</span>
        </NavLink>

        <NavLink to="/settings">
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.4 1V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-.4-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.4H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1-.4 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.13 3.3l.06.06A1.65 1.65 0 0 0 9 4.6c.39 0 .77-.15 1-.4A1.65 1.65 0 0 0 10.4 3V3a2 2 0 1 1 4 0v.09c0 .39.15.77.4 1 .23.25.61.4 1 .4.39 0 .77-.15 1-.4l.06-.06A2 2 0 1 1 21 7.13l-.06.06c-.25.23-.4.61-.4 1 0 .39.15.77.4 1 .25.23.61.4 1 .4H21a2 2 0 1 1 0 4h-.09c-.39 0-.77.15-1 .4-.25.23-.4.61-.4 1z" />
            </svg>
          </span>
          <span>Themes</span>
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;