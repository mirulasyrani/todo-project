import React, { useState } from "react";
import API_BASE from "../api";

function LoginRegister({ onLoginSuccess }) {
  const [formType, setFormType] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === "login" ? "/login" : "/register";
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`${formType} successful`);
      if (formType === "login") {
        onLoginSuccess(data.user); // pass user object up
      }
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>{formType === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">{formType}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setFormType(formType === "login" ? "register" : "login")}>
        Switch to {formType === "login" ? "Register" : "Login"}
      </button>
    </div>
  );
}

export default LoginRegister;
