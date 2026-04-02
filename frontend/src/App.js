import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Pomodoro from "./pages/Pomodoro";
import Progress from "./pages/Progress";
import Materials from "./pages/Materials";

function AppLayout({ children, darkMode, setDarkMode }) {
  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />
      <div className="main-section">
        <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Planner />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Pomodoro />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Progress />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Materials />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;