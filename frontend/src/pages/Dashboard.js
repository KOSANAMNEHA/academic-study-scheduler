import React, { useEffect, useState } from "react";
import { Clock3, CheckCircle2, ListTodo, TrendingUp } from "lucide-react";
import StatCard from "../components/common/StatCard";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    studiedHours: 0,
    completed: 0,
    pending: 0,
    sessions: 0
  });

  const quotes = [
    { text: "Keep going, your hard work will pay off.", author: "Unknown" },
    { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
    { text: "Push yourself, because no one else will do it for you.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Small progress is still progress.", author: "Unknown" },
    { text: "Stay focused and never give up.", author: "Unknown" },
    { text: "Your future is created by what you do today.", author: "Unknown" }
  ];

  const [motivationText, setMotivationText] = useState("");
  const [motivationAuthor, setMotivationAuthor] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchDashboardStats();

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationText(randomQuote.text);
    setMotivationAuthor(randomQuote.author);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks");
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const tasksRes = await API.get("/tasks");
      const sessionsRes = await API.get("/sessions");

      const allTasks = tasksRes.data;
      const allSessions = sessionsRes.data;

      const completed = allTasks.filter((task) => task.completed).length;
      const pending = allTasks.filter((task) => !task.completed).length;
      const totalMinutes = allSessions.reduce(
        (sum, session) => sum + session.minutes,
        0
      );

      setStats({
        studiedHours: (totalMinutes / 60).toFixed(1),
        completed,
        pending,
        sessions: allSessions.length
      });
    } catch (err) {
      console.log("Error fetching stats");
    }
  };

  const getDayFromDate = (dateString) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayMap[dayIndex];
  };

  const todayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayShort = todayMap[new Date().getDay()];

  const todayTasks = tasks.filter((task) => getDayFromDate(task.date) === todayShort);

  return (
    <div>
      <div className="stats-grid">
        <StatCard
          title="Hours Studied"
          value={stats.studiedHours}
          subtitle="Total study time"
          icon={<Clock3 size={22} />}
          colorClass="purple-bg"
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          subtitle="Finished tasks"
          icon={<CheckCircle2 size={22} />}
          colorClass="green-bg"
        />

        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="Tasks to complete"
          icon={<ListTodo size={22} />}
          colorClass="orange-bg"
        />

        <StatCard
          title="Pomodoro Sessions"
          value={stats.sessions}
          subtitle="Focus sessions"
          icon={<TrendingUp size={22} />}
          colorClass="pink-bg"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <h2>Today's Tasks</h2>
              <p>{todayShort}</p>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <p className="empty-text">No tasks for today</p>
          ) : (
            todayTasks.map((task) => (
              <div className="task-item" key={task._id}>
                <div>
                  <h4>{task.subject.toUpperCase()}</h4>
                  <h3>{task.subject}</h3>
                  <p>
                    {task.startTime} - {task.endTime}
                  </p>
                </div>

                <span
                  className={`priority-badge ${task.priority.toLowerCase()}-badge`}
                >
                  {task.priority.toLowerCase()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="panel motivation-panel">
          <h3>Daily Motivation</h3>
          <h2>"{motivationText}"</h2>
          <p>— {motivationAuthor}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;