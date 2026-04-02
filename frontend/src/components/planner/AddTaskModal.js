import React, { useEffect, useState } from "react";
import API from "../../services/api";

function AddTaskModal({ open, onClose, onTaskAdded, editTask }) {
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    priority: "Medium",
    startTime: "",
    endTime: "",
    color: "#7c3aed"
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        subject: editTask.subject || "",
        date: editTask.date || "",
        priority: editTask.priority || "Medium",
        startTime: editTask.startTime || "",
        endTime: editTask.endTime || "",
        color: editTask.color || "#7c3aed"
      });
    } else {
      setFormData({
        subject: "",
        date: "",
        priority: "Medium",
        startTime: "",
        endTime: "",
        color: "#7c3aed"
      });
    }
  }, [editTask, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editTask) {
        await API.put(`/tasks/${editTask._id}`, formData);
      } else {
        await API.post("/tasks", formData);
      }

      setFormData({
        subject: "",
        date: "",
        priority: "Medium",
        startTime: "",
        endTime: "",
        color: "#7c3aed"
      });

      onTaskAdded();
      onClose();
    } catch (err) {
      console.log("TASK SAVE ERROR:", err.response?.data || err.message);
    }
  };

  if (!open) return null;

  const colors = [
    "#7c3aed",
    "#8b5cf6",
    "#ec4899",
    "#ef4444",
    "#f97316",
    "#22c55e",
    "#14b8a6",
    "#3b82f6"
  ];

  return (
    <div className="modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <h2>{editTask ? "Edit Task" : "Add New Task"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter subject name"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <div className="two-col">
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Color</label>
          <div className="color-row">
            {colors.map((color) => (
              <button
                type="button"
                key={color}
                className={
                  formData.color === color ? "color-dot selected" : "color-dot"
                }
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              ></button>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;