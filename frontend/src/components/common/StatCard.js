import React from "react";

function StatCard({ title, value, subtitle, icon, colorClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <h4>{title}</h4>
      <h2>{value}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default StatCard;