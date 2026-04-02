import React, { useEffect, useRef, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import API from "../../services/api";

function Topbar({ darkMode, setDarkMode }) {
  const userName = localStorage.getItem("userName") || "User";
  const loginDate = localStorage.getItem("loginDate") || "";

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);

  const fetchDynamicNotifications = async () => {
    try {
      const tasksRes = await API.get("/tasks");
      const sessionsRes = await API.get("/sessions");

      const tasks = tasksRes.data || [];
      const sessions = sessionsRes.data || [];

      const today = new Date();
      const todayDate = today.toISOString().split("T")[0];

      const todayTasks = tasks.filter((task) => task.date === todayDate);
      const pendingTasks = tasks.filter((task) => !task.completed);
      const highPriorityTasks = tasks.filter(
        (task) => task.priority === "High" && !task.completed
      );

      const todaySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date).toISOString().split("T")[0];
        return sessionDate === todayDate;
      });

      const dynamicNotifications = [];

      if (todayTasks.length > 0) {
        dynamicNotifications.push(
          `You have ${todayTasks.length} task(s) scheduled for today.`
        );
      } else {
        dynamicNotifications.push("No tasks scheduled for today. Plan something useful.");
      }

      if (pendingTasks.length > 0) {
        dynamicNotifications.push(
          `You still have ${pendingTasks.length} pending task(s) to complete.`
        );
      }

      if (highPriorityTasks.length > 0) {
        dynamicNotifications.push(
          `${highPriorityTasks.length} high priority task(s) need your attention.`
        );
      }

      if (todaySessions.length === 0) {
        dynamicNotifications.push("You have not completed any focus session today.");
      } else {
        dynamicNotifications.push(
          `Great! You completed ${todaySessions.length} focus session(s) today.`
        );
      }

      if (dynamicNotifications.length === 0) {
        dynamicNotifications.push("You are all caught up. Keep the momentum going!");
      }

      setNotifications(dynamicNotifications);

      if (!showNotifications) {
        setUnreadCount(dynamicNotifications.length);
      }
    } catch (err) {
      console.log("Notification load error");
      setNotifications(["Unable to load notifications right now."]);
      if (!showNotifications) {
        setUnreadCount(1);
      }
    }
  };

  useEffect(() => {
    fetchDynamicNotifications();

    const interval = setInterval(() => {
      fetchDynamicNotifications();
    }, 10000);

    const handleNotificationRefresh = () => {
      fetchDynamicNotifications();
    };

    window.addEventListener("refreshNotifications", handleNotificationRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshNotifications", handleNotificationRefresh);
    };
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="topbar">
      <div>
        <h1>Welcome back, {userName}! 👋</h1>
        <p>{loginDate}</p>
      </div>

      <div className="top-icons">
        <div className="notification-wrapper" ref={notificationRef}>
          <button className="icon-btn" onClick={toggleNotifications}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button
                  className="refresh-btn"
                  onClick={fetchDynamicNotifications}
                  type="button"
                >
                  Refresh
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="notification-empty">No notifications</p>
              ) : (
                notifications.map((item, index) => (
                  <div key={index} className="notification-item">
                    {item}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button className="icon-btn" onClick={toggleTheme}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
}

export default Topbar;