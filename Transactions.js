import React, { useState } from "react";
import "./Transactions.css";

function Transactions({ transactions, onGenerate, role }) {
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState(null);
  const [generateCount, setGenerateCount] = useState(1);

  const maskAccount = (acc) => {
    if (!acc) return "";
    return "****" + acc.slice(-4);
  };

  const getStatus = (tx) => (tx.suspicious ? "BLOCKED" : "APPROVED");

  // ✅ FIXED (async safe)
  const handleGenerate = async () => {
    for (let i = 0; i < generateCount; i++) {
      await onGenerate(); // important
    }
  };

  const filtered = transactions.filter((tx) => {
    const status = getStatus(tx);

    return (
      (riskFilter === "ALL" || tx.risk === riskFilter) &&
      (statusFilter === "ALL" || status === statusFilter)
    );
  });

  return (
    <div className="tx-container">

      <div className="tx-header">
        <h2>Transactions</h2>

        <div className="actions">
          {role === "ADMIN" && (
            <>
              <select
                value={generateCount}
                onChange={(e) => setGenerateCount(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={5}>5</option>
              </select>

              <button onClick={handleGenerate}>
                Generate Transaction
              </button>
            </>
          )}
        </div>
      </div>

      <div className="filters">
        <select onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="ALL">All Risk</option>
          <option value="SAFE">Safe</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <table className="tx-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Time</th>
            <th>Account</th>
            <th>Type</th>
            <th>Location</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((tx) => {
            const status = getStatus(tx);

            return (
              <tr
                key={tx.id} // ✅ FIXED KEY
                className={`row-${tx.risk?.toLowerCase() || "safe"}`}
                onClick={() => setSelectedTx(tx)}
              >
                <td>{tx.id}</td>

                <td>
                  {tx.timestamp
                    ? new Date(tx.timestamp).toLocaleString()
                    : "—"}
                </td>

                <td>{maskAccount(tx.accountNumber)}</td>
                <td>{tx.transactionType || "CARD"}</td>
                <td>{tx.location || "—"}</td>
                <td>₹{tx.amount}</td>
                <td>{tx.risk}</td>
                <td className={status.toLowerCase()}>{status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedTx && (
        <div className="modal">
          <div className="modal-content">

            <div className="modal-header">
              <h3>Transaction Details</h3>
              <span className={`status-badge ${getStatus(selectedTx).toLowerCase()}`}>
                {getStatus(selectedTx)}
              </span>
            </div>

            <div className="info-grid">
              <div><label>ID</label><span>{selectedTx.id}</span></div>
              <div>
                <label>Time</label>
                <span>
                  {selectedTx.timestamp
                    ? new Date(selectedTx.timestamp).toLocaleString()
                    : "—"}
                </span>
              </div>
              <div><label>Account</label><span>{maskAccount(selectedTx.accountNumber)}</span></div>
              <div><label>Type</label><span>{selectedTx.transactionType}</span></div>
              <div><label>Location</label><span>{selectedTx.location || "—"}</span></div>
              <div><label>Amount</label><span>₹{selectedTx.amount}</span></div>
            </div>

            <div className="risk-section">
              <label>Risk Level: {selectedTx.risk}</label>
              <div className="risk-bar">
                <div
                  className={`risk-fill ${selectedTx.risk.toLowerCase()}`}
                  style={{
                    width:
                      selectedTx.risk === "HIGH"
                        ? "90%"
                        : selectedTx.risk === "MEDIUM"
                        ? "60%"
                        : "30%"
                  }}
                />
              </div>
            </div>

            <button className="close-btn" onClick={() => setSelectedTx(null)}>
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Transactions;
