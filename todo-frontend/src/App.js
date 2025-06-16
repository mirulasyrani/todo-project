import './App.css';
import React, { useState, useEffect } from "react";

const API_BASE = "https://todo-project-production-db01.up.railway.app";

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/task?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // ✅ Ensure data is an array
          if (Array.isArray(data)) {
            setTasks(data);
          } else {
            console.error("Tasks data is not an array:", data);
            setTasks([]);
          }
        })
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [user]);

  const handleAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user || data);
        setUsername("");
        setPassword("");
      } else {
        alert(data.error || "Auth failed");
      }
    } catch (err) {
      console.error("Auth request failed:", err.message);
      alert("Unable to connect to server. Make sure the backend is running.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          completed: false,
          user_id: user.id,
        }),
      });

      if (!res.ok) throw new Error('Failed to add task');

      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Add task error:', err.message);
      alert('Error adding task');
    }
  };

  const handleToggle = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE}/task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !current }),
      });
      if (res.ok) {
        setTasks(tasks.map((task) =>
          task.id === id ? { ...task, completed: !current } : task
        ));
      }
    } catch (err) {
      console.error("Toggle task error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/task/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (err) {
      console.error("Delete task error:", err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">TODO List</h1>

      {!user ? (
        <div className="auth-box">
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />
          <button onClick={handleAuth} className="btn">
            {authMode === "login" ? "Login" : "Register"}
          </button>
          <p>
            {authMode === "login" ? "No account?" : "Already have an account?"}{" "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="link-btn"
            >
              {authMode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div className="task-box">
          <p>
            Welcome, <strong>{user.username}</strong>{" "}
            <button onClick={handleLogout} className="btn logout-btn">
              Logout
            </button>
          </p>
          <div className="add-task">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task"
            />
            <button onClick={handleAdd} className="btn add-btn">
              Add
            </button>
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id, task.completed)}
                  />
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>
                </label>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn delete-btn"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
