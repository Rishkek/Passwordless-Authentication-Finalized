import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import AddUser from "./pages/AddUser";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("keyAuth_currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  const isAuthPage = location.pathname === "/profile";

  return (
    <div className="layout">

      {currentUser && !isAuthPage && (
        <Sidebar currentUser={currentUser} />
      )}

      <div className="page">
        <Routes>


          <Route
            path="/"
            element={
              <Navigate to={currentUser ? "/home" : "/profile"} />
            }
          />


          <Route
            path="/profile"
            element={
              currentUser
                ? <Navigate to="/home" />
                : <Profile setCurrentUser={setCurrentUser} />
            }
          />

          <Route
            path="/home"
            element={
              currentUser
                ? <Home setCurrentUser={setCurrentUser} />
                : <Navigate to="/profile" />
            }
          />


          <Route
            path="/add-user"
            element={
              currentUser
                ? <AddUser />
                : <Navigate to="/profile" />
            }
          />


          <Route
            path="/settings"
            element={
              currentUser
                ? <Settings />
                : <Navigate to="/profile" />
            }
          />


          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;