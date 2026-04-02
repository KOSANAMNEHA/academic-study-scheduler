import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";

function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const timerRef = useRef(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const saveStudySession = async () => {
      try {
        await API.post("/sessions", {
          subject: selectedSubject,
          minutes: mode === "focus" ? 25 : 5,
          mode
        });

        window.dispatchEvent(new Event("refreshNotifications"));
      } catch (err) {
        console.log("Session save error");
      }
    };

    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);

            if (mode === "focus" && selectedSubject) {
              saveStudySession();
            }

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.log("Error loading subjects");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    clearInterval(timerRef.current);
    setSecondsLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setSecondsLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="pomodoro-page">
      <h1>Pomodoro Timer</h1>
      <p>Stay focused with the Pomodoro Technique</p>

      <div className="pomodoro-card">
        <div className="pomodoro-tabs">
          <button
            className={mode === "focus" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => switchMode("focus")}
          >
            Focus
          </button>

          <button
            className={mode === "break" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => switchMode("break")}
          >
            Break
          </button>
        </div>

        <select
          className="subject-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select subject</option>

          {subjects.map((subject) => (
            <option key={subject._id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>

        <div className="timer-circle">
          <h2>
            {minutes}:{seconds}
          </h2>
          <p>{mode === "focus" ? "Focus Time" : "Break Time"}</p>
        </div>

        <div className="timer-actions">
          <button className="primary-btn" onClick={handleStartPause}>
            {isRunning ? "Pause Timer" : "Start Timer"}
          </button>

          <button className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;