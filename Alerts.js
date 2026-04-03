import React, { useEffect, useState } from "react";
import "./Alerts.css";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = () => {
    fetch("http://localhost:8080/api/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data || []))
      .catch(err => console.error("Error fetching alerts:", err));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Fraud Alerts</h2>
        <button onClick={fetchAlerts}>Refresh</button>
      </div>

      {alerts.length === 0 ? (
        <p className="no-alerts">No alerts available</p>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} className={`alert-card ${alert.severity?.toLowerCase()}`}>
            
            <div className="alert-left">
              <span className="alert-id">TX #{alert.transactionId}</span>
              <span className="alert-message">{alert.alertMessage}</span>
            </div>

            <div className="alert-right">
              <span className="severity">{alert.severity}</span>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;