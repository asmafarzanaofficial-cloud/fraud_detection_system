import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./MLInsights.css";

function MLInsights({ transactions }) {

  // ===== SIMULATED ML =====
  const getMLPrediction = (tx) => {
    return tx.amount > 40000; // 🔥 tweak threshold if needed
  };

  const TP = transactions.filter(t => getMLPrediction(t) && t.suspicious).length;
  const FP = transactions.filter(t => getMLPrediction(t) && !t.suspicious).length;
  const FN = transactions.filter(t => !getMLPrediction(t) && t.suspicious).length;
  const TN = transactions.filter(t => !getMLPrediction(t) && !t.suspicious).length;

  const precision = TP / (TP + FP || 1);
  const recall = TP / (TP + FN || 1);
  const f1 = 2 * ((precision * recall) / (precision + recall || 1));
  const accuracy = (TP + TN) / (TP + TN + FP + FN || 1);

  // ===== PIE =====
  const fraudCount = transactions.filter(t => t.suspicious).length;
  const legitCount = transactions.length - fraudCount;

  const pieData = {
    labels: ["Fraud", "Legit"],
    datasets: [{
      data: [fraudCount, legitCount],
      backgroundColor: ["#ef4444", "#22c55e"],
      borderWidth: 0
    }]
  };

  // ===== RULE vs ML =====
  const mlFraud = transactions.filter(t => getMLPrediction(t)).length;
  const ruleFraud = fraudCount;

  const comparisonData = {
    labels: ["ML Detection", "Rule-Based"],
    datasets: [{
      label: "Fraud Count",
      data: [mlFraud, ruleFraud],
      backgroundColor: ["#3b82f6", "#f97316"]
    }]
  };

  return (
    <div>

      <h2>ML Insights</h2>

      {/* ===== METRICS ===== */}
      <div className="ml-metrics">

        <div className="metric-card">
          Precision
          <b>{precision.toFixed(2)}</b>
        </div>

        <div className="metric-card">
          Recall
          <b>{recall.toFixed(2)}</b>
        </div>

        <div className="metric-card">
          F1 Score
          <b>{f1.toFixed(2)}</b>
        </div>

        <div className="metric-card">
          Accuracy
          <b>{(accuracy * 100).toFixed(1)}%</b>
        </div>

      </div>

      {/* ===== CHARTS ===== */}
      <div className="ml-main">

        <div className="ml-chart">
          <h4>Fraud Distribution</h4>
          <Pie data={pieData} />
        </div>

        <div className="ml-chart">
          <h4>ML vs Rule Detection</h4>
          <Bar data={comparisonData} />
        </div>

      </div>

      {/* ===== CONFUSION MATRIX ===== */}
      <h3>Confusion Matrix</h3>

      <div className="ml-confusion">
        <div className="conf-card">TP <b>{TP}</b></div>
        <div className="conf-card">FP <b>{FP}</b></div>
        <div className="conf-card">FN <b>{FN}</b></div>
        <div className="conf-card">TN <b>{TN}</b></div>
      </div>

    </div>
  );
}

export default MLInsights;
