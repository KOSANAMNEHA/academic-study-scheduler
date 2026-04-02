import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function Progress() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksRes = await API.get("/tasks");
      const sessionsRes = await API.get("/sessions");

      setTasks(tasksRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      console.log("Error fetching progress data");
    }
  };

  const completionPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  return (
    <div>
      <div className="progress-grid">
        <div className="panel">
          <h2>Task Completion</h2>

          <div className="progress-ring-box">
            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(#22c55e ${completionPercent}%, #e2e8f0 ${completionPercent}%)`
              }}
            >
              <div className="progress-inner">
                <h2>{completionPercent}%</h2>
                <p>Complete</p>
              </div>
            </div>
          </div>

          <div className="progress-legend">
            <span>
              <span className="green-dot"></span> Completed
            </span>
            <span>
              <span className="gray-dot"></span> Pending
            </span>
          </div>
        </div>

        <div className="panel">
          <h2>Study Activity (Last 30 Days)</h2>
          <div className="activity-grid">
            {Array.from({ length: 30 }).map((_, index) => (
              <div
                key={index}
                className={`activity-box level-${(index % 5) + 1}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel recent-panel">
        <h2>Recent Study Sessions</h2>

        {sessions.length === 0 ? (
          <p className="empty-text">No study sessions yet</p>
        ) : (
          sessions.slice(0, 6).map((session) => (
            <div className="session-row" key={session._id}>
              <div>
                <h3>{session.subject}</h3>
                <p>{new Date(session.date).toDateString()}</p>
              </div>

              <div className="session-right">
                <strong>{session.minutes} min</strong>
                <p>{session.mode} session</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Progress;