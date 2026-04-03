import React, { useState, useEffect } from "react";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Alerts from "./components/Alerts";
import Login from "./components/Login";
import SystemHealth from "./components/SystemHealth";
import MLInsights from "./components/MLInsights";

import { generateTransaction } from "./services/api";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [page, setPage] = useState("dashboard");

  const [transactions, setTransactions] = useState([]);
  const [safe, setSafe] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);

  // ================= LOAD DATA =================
  const loadTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/transactions");
      const data = await res.json();

      let s = 0, m = 0, h = 0;

      (data || []).forEach((tx) => {
        const risk = tx.suspicious
          ? "HIGH"
          : tx.amount > 30000
          ? "MEDIUM"
          : "SAFE";

        tx.risk = risk;

        if (risk === "SAFE") s++;
        else if (risk === "MEDIUM") m++;
        else h++;
      });

      setTransactions(data || []);
      setSafe(s);
      setMedium(m);
      setHigh(h);

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (role) {
      loadTransactions();
    }
  }, [role]);

  // ================= GENERATE =================
  const handleGenerate = async () => {
    try {
      await generateTransaction(); // call backend

      // ✅ reload fresh data (IMPORTANT FIX)
      await loadTransactions();

    } catch (err) {
      console.error("Generate error:", err);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  // ================= LOGIN =================
  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <div style={{ display: "flex" }}>

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar" style={{ width: "240px" }}>

        <div className="logo">
          <div className="logo-icon">FM</div>
          <h2>Fraud Monitor</h2>
        </div>

        <div className={`role-badge ${role.toLowerCase()}`}>
          Logged in as {role}
        </div>

        <div className="nav">

          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={page === "transactions" ? "active" : ""}
            onClick={() => setPage("transactions")}
          >
            Transactions
          </button>

          <button
            className={page === "ml" ? "active" : ""}
            onClick={() => setPage("ml")}
          >
            ML Insights
          </button>

          {role === "ADMIN" && (
            <>
              <button
                className={page === "alerts" ? "active" : ""}
                onClick={() => setPage("alerts")}
              >
                Alerts
              </button>

              <button
                className={page === "system" ? "active" : ""}
                onClick={() => setPage("system")}
              >
                System Health
              </button>
            </>
          )}

        </div>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="content">

        {page === "dashboard" && (
          <Dashboard
            transactions={transactions}
            safe={safe}
            medium={medium}
            high={high}
          />
        )}

        {page === "transactions" && (
          <Transactions
            transactions={transactions}
            onGenerate={handleGenerate}
            role={role}
          />
        )}

        {page === "alerts" && role === "ADMIN" && <Alerts />}

        {page === "system" && role === "ADMIN" && <SystemHealth />}

        {page === "ml" && (
          <MLInsights transactions={transactions} />
        )}

      </div>
    </div>
  );
}

export default App;
