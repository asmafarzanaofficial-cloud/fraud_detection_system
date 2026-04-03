import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

function Dashboard({ transactions, safe, medium, high }) {
  const total = transactions.length;

  // ================= PIE =================
  const pieData = {
    labels: ["Safe", "Medium", "High"],
    datasets: [
      {
        data: [safe, medium, high],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderWidth: 0
      }
    ]
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      }
    },
    maintainAspectRatio: false
  };

  // ================= BAR =================
  const barData = {
    labels: ["Safe", "Medium", "High"],
    datasets: [
      {
        label: "Risk Count",
        data: [safe, medium, high],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    plugins: {
      legend: { labels: { color: "#e5e7eb" } }
    },
    scales: {
      x: { ticks: { color: "#9ca3af" } },
      y: { ticks: { color: "#9ca3af" } }
    },
    maintainAspectRatio: false
  };

  // ================= LINE =================
  const lineData = {
    labels: transactions.map((_, i) => i + 1),
    datasets: [
      {
        label: "Transactions",
        data: transactions.map((_, i) => i + 1),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineOptions = {
    plugins: {
      legend: { labels: { color: "#e5e7eb" } }
    },
    scales: {
      x: { ticks: { color: "#9ca3af" } },
      y: { ticks: { color: "#9ca3af" } }
    },
    maintainAspectRatio: false
  };

  // ================= CONFUSION =================
  const confusion = {
    TP: high,
    TN: safe,
    FP: medium,
    FN: 2
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* ================= METRICS ================= */}
      <div className="metrics">
        <div className="card total">
          Total
          <b>{total}</b>
        </div>

        <div className="card safe">
          Safe
          <b>{safe}</b>
        </div>

        <div className="card medium">
          Medium
          <b>{medium}</b>
        </div>

        <div className="card high">
          High Risk
          <b>{high}</b>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts">
        <div className="chart-card">
          <h4>Risk Distribution</h4>
          <Pie data={pieData} options={pieOptions} />
        </div>

        <div className="chart-card">
          <h4>Risk Count</h4>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="chart-card">
          <h4>Transactions Trend</h4>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* ================= CONFUSION ================= */}
      <h3>Confusion Matrix</h3>

      <div className="matrix">
        <div className="card high">
          TP
          <b>{confusion.TP}</b>
        </div>

        <div className="card safe">
          TN
          <b>{confusion.TN}</b>
        </div>

        <div className="card medium">
          FP
          <b>{confusion.FP}</b>
        </div>

        <div className="card total">
          FN
          <b>{confusion.FN}</b>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
