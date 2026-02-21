import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">KeyAuth</h2>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/add-user">Add User</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;