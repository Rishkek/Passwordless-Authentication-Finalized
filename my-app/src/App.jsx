import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ConsentModal from "./components/ConsentModal";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <ConsentModal />
      <div className="layout">
        <Sidebar />
        <div className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;