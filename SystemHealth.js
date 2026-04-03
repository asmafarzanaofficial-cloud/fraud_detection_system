import React from "react";
import "./SystemHealth.css";

function SystemHealth() {

  const stats = {
    api: "ONLINE",
    engine: "RUNNING",
    processed: 12123,
    errorRate: "14.78%"
  };

  const components = [
    { name: "Dashboard API", status: "Healthy" },
    { name: "Simulation Engine", status: "Running" },
    { name: "Fraud Detection Pipeline", status: "High Load" }
  ];

  return (
    <div>

      <h2>API Activity & System Health</h2>

      {/* TOP METRICS */}
      <div className="health-metrics">

        <div className="health-card online">
          <p>API STATUS</p>
          <h3>{stats.api}</h3>
        </div>

        <div className="health-card running">
          <p>SYSTEM ENGINE</p>
          <h3>{stats.engine}</h3>
        </div>

        <div className="health-card info">
          <p>TRANSACTIONS PROCESSED</p>
          <h3>{stats.processed}</h3>
        </div>

        <div className="health-card danger">
          <p>ERROR RATE</p>
          <h3>{stats.errorRate}</h3>
        </div>

      </div>

      {/* COMPONENT STATUS */}
      <div className="health-section">
        <h3>Component Status</h3>

        {components.map((comp, i) => (
          <div key={i} className="component-card">
            <span>{comp.name}</span>
            <span className="status">{comp.status}</span>
          </div>
        ))}
      </div>

      {/* LOGS */}
      <div className="health-section">
        <h3>System Logs</h3>

        <div className="log">
          [08:42:17] Fraud pipeline initialized
        </div>
        <div className="log">
          [08:42:19] Transaction processed successfully
        </div>
        <div className="log warning">
          [08:42:21] High latency detected
        </div>
      </div>

    </div>
  );
}

export default SystemHealth;
