import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const quotes = [
    {
      text: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
      author: "Marie Forleo"
    },
    {
      text: "Push yourself, because no one else is going to do it for you.",
      author: "Unknown"
    },
    {
      text: "Dream big, start small, but most of all start.",
      author: "Simon Sinek"
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes"
    },
    {
      text: "Don’t watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "Hard work beats talent when talent doesn’t work hard.",
      author: "Tim Notke"
    },
    {
      text: "Small progress is still progress.",
      author: "Unknown"
    },
    {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Abraham Lincoln"
    },
    {
      text: "Your future is created by what you do today, not tomorrow.",
      author: "Robert Kiyosaki"
    },
    {
      text: "The pain of studying is temporary, but the pride of success lasts forever.",
      author: "Unknown"
    }
  ];

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);

      const loginDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      localStorage.setItem("loginDate", loginDate);

      // Random motivation quote on every login
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      localStorage.setItem("motivationText", randomQuote.text);
      localStorage.setItem("motivationAuthor", randomQuote.author);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2>StudyFlow</h2>
            <p>Academic Study Scheduler</p>
          </div>
        </div>

        <h1>Sign In</h1>
        <p className="auth-subtext">Welcome back! Please login to continue.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn full-btn">
            Login
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;