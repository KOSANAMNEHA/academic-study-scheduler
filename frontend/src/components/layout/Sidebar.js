import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  TimerReset,
  BarChart3,
  GraduationCap,
  LogOut,
  BookOpen
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("loginDate");
  localStorage.removeItem("motivationText");
  localStorage.removeItem("motivationAuthor");
  navigate("/login");
};

  return (
    <div className="sidebar">
      <div>
        <div className="logo-box">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>

          <div>
            <h2>StudyFlow</h2>
            <p>Smart Study Planner</p>
          </div>
        </div>

        <div className="menu-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <CalendarDays size={20} />
            <span>Study Planner</span>
          </NavLink>

          <NavLink
            to="/pomodoro"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <TimerReset size={20} />
            <span>Pomodoro Timer</span>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <BarChart3 size={20} />
            <span>Progress Tracker</span>
          </NavLink>
          <NavLink
  to="/materials"
  className={({ isActive }) =>
    isActive ? "menu-link active" : "menu-link"
  }
>
  <BookOpen size={20} />
  <span>Materials</span>
</NavLink>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;