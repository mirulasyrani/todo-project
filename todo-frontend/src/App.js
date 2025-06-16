import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // or 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks if user is logged in
  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/task`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [user]);

  // Handle Login/Register
  const handleAuth = async () => {
    const res = await fetch(`${API_BASE}/${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user || data); // Depends on API response shape
      setUsername("");
      setPassword("");
    } else {
      alert(data.error || "Auth failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  // Add new task
const handleAdd = async () => {
  if (!newTask.trim()) return;

  const USER_ID = user.id; // dynamically use logged-in user

  const res = await fetch(`${API_BASE}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTask,
      completed: false,
      user_id: USER_ID,
    }),
  });

  const added = await res.json();
  setTasks([...tasks, added]);
  setNewTask("");
};




  const handleToggle = async (id, current) => {
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
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/task/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h1>TODO List</h1>

      {!user ? (
        <div>
          <h2>{authMode === "login" ? "Login" : "Register"}</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleAuth}>
            {authMode === "login" ? "Login" : "Register"}
          </button>
          <p>
            {authMode === "login" ? "No account?" : "Already have an account?"}{" "}
            <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
              {authMode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.username} <button onClick={handleLogout}>Logout</button></p>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
          />
          <button onClick={handleAdd}>Add</button>

          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id, task.completed)}
                />
                {task.title}
                <button onClick={() => handleDelete(task.id)}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
