import React, { useState, useEffect } from "react";
import "./Login.css";
import bg from "../assets/bg.jpg";
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("lastEmail");
    if (storedEmail) {
      setSavedEmail(storedEmail);
    }
  }, []);

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    if (email === "fraudadmin@gmail.com" && password === "admin@2222") {
      localStorage.setItem("role", "ADMIN");
      localStorage.setItem("lastEmail", email);
      onLogin("ADMIN");
    } else if (email === "analyst@gmail.com" && password === "analyst123") {
      localStorage.setItem("role", "ANALYST");
      localStorage.setItem("lastEmail", email);
      onLogin("ANALYST");
    } else {
      setError("Invalid credentials. Please verify your access.");
    }
  };

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* OVERLAY */}
      <div className="overlay"></div>

      {/* LEFT CONTENT (branding only, no image here) */}
      <div className="left-panel">
        <div className="branding">
          <h1>Fraud Monitoring</h1>
          <h2>& Anomaly Detection Platform</h2>

          <p>
            Real-time transaction monitoring, anomaly detection, and fraud risk
            analysis for financial systems.
          </p>

          <div className="roles">
            <div><FaUserShield /> Admin Access</div>
            <div><FaUserShield /> Analyst Access</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="login-card">

          <h2>Secure Login</h2>

          {savedEmail && !email && (
            <div
              className="saved-account"
              onClick={() => setEmail(savedEmail)}
            >
              Continue as <strong>{savedEmail}</strong>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={handleLogin}>Sign In</button>

          <p className="note">
            Authorized access only. Admin and Analyst roles are monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
