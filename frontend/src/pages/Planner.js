import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import API from "../services/api";
import AddTaskModal from "../components/planner/AddTaskModal";

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("weekly");
  const [editTask, setEditTask] = useState(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks");
    }
  };

  const getDayFromDate = (dateString) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayMap[dayIndex];
  };

  const getTasksByDay = (day) => {
    return tasks.filter((task) => getDayFromDate(task.date) === day);
  };

  const calendarTasks = [...tasks].sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
      window.dispatchEvent(new Event("refreshNotifications"));
    } catch (err) {
      console.log("Delete failed");
    }
  };

  const handleAddNew = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setModalOpen(false);
  };

  const uniqueTimeSlots = [...new Set(
    tasks.map((task) => `${task.startTime} - ${task.endTime}`)
  )].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Study Planner</h1>
          <p>Organize your weekly study schedule</p>
        </div>

        <button className="primary-btn" onClick={handleAddNew}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="planner-tabs">
        <button
          className={viewMode === "weekly" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => setViewMode("weekly")}
        >
          Weekly View
        </button>

        <button
          className={viewMode === "calendar" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => setViewMode("calendar")}
        >
          Calendar View
        </button>

        <button
          className={viewMode === "timetable" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => setViewMode("timetable")}
        >
          Generated Timetable
        </button>
      </div>

      {viewMode === "weekly" && (
        <div className="planner-grid">
          {days.map((day) => (
            <div
              className={`day-card ${day === "Thu" ? "today-card" : ""}`}
              key={day}
            >
              <div className="day-header">
                <h3>{day}</h3>
                <Plus size={18} />
              </div>

              {getTasksByDay(day).length === 0 ? (
                <p className="no-task">No tasks</p>
              ) : (
                getTasksByDay(day).map((task) => (
                  <div
                    className="mini-task"
                    key={task._id}
                    style={{ borderLeft: `5px solid ${task.color}` }}
                  >
                    <strong>{task.subject}</strong>
                    <p>{task.priority} Priority</p>
                    <p>{task.date}</p>
                    <span>
                      {task.startTime} - {task.endTime}
                    </span>

                    <div className="task-actions">
                      <button
                        className="icon-action-btn edit-btn"
                        onClick={() => handleEdit(task)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="icon-action-btn delete-btn"
                        onClick={() => handleDelete(task._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="calendar-view-box">
          <div className="calendar-header-row">
            <span>Date</span>
            <span>Subject</span>
            <span>Priority</span>
            <span>Time</span>
            <span>Actions</span>
          </div>

          {calendarTasks.length === 0 ? (
            <p className="empty-calendar-text">No tasks added yet</p>
          ) : (
            calendarTasks.map((task) => (
              <div className="calendar-task-row" key={task._id}>
                <div>{task.date}</div>

                <div className="calendar-subject">
                  <span
                    className="calendar-color-dot"
                    style={{ backgroundColor: task.color }}
                  ></span>
                  {task.subject}
                </div>

                <div>{task.priority}</div>

                <div>
                  {task.startTime} - {task.endTime}
                </div>

                <div className="calendar-actions">
                  <button
                    className="icon-action-btn edit-btn"
                    onClick={() => handleEdit(task)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => handleDelete(task._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === "timetable" && (
        <div className="calendar-view-box">
          <h2 style={{ marginBottom: "20px" }}>Generated Timetable</h2>

          {uniqueTimeSlots.length === 0 ? (
            <p className="empty-calendar-text">No timetable generated yet</p>
          ) : (
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                  <th>Sun</th>
                </tr>
              </thead>

              <tbody>
                {uniqueTimeSlots.map((time) => (
                  <tr key={time}>
                    <td>{time}</td>

                    {days.map((day) => {
                      const task = tasks.find(
                        (t) =>
                          getDayFromDate(t.date) === day &&
                          `${t.startTime} - ${t.endTime}` === time
                      );

                      return (
                        <td key={day}>
                          {task ? (
                            <div
                              style={{
                                background: task.color,
                                color: "#ffffff",
                                padding: "8px",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              {task.subject}
                              <br />
                              {task.priority}
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <AddTaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onTaskAdded={() => {
          fetchTasks();
          window.dispatchEvent(new Event("refreshNotifications"));
        }}
        editTask={editTask}
      />
    </div>
  );
}

export default Planner;