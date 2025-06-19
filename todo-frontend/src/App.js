import React, { useState, useEffect } from "react";

const API_BASE = "https://todo-project-production-db01.up.railway.app";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (token && savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/task?user_id=${user.id}`, {
        headers: authHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTasks(data);
          else setTasks([]);
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setUsername("");
        setPassword("");
      } else {
        alert(data.error || "Auth failed");
      }
    } catch (err) {
      alert("Backend not reachable.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/task`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: newTaskTitle,
          completed: false,
          user_id: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setTasks([...tasks, data]);
      setNewTaskTitle("");
    } catch {
      alert("Failed to add task.");
    }
  };

  const handleToggle = async (id, current) => {
    try {
      const res = await fetch(`${API_BASE}/task/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ completed: !current }),
      });
      if (res.ok) {
        setTasks(tasks.map((task) =>
          task.id === id ? { ...task, completed: !current } : task
        ));
      }
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/task/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        const errData = await res.json();
        console.error("Delete failed:", errData);
        alert(errData.error || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting task.");
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] px-4 py-8 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-bold mb-8 tracking-tight text-center text-[#2f81f7]">
        ✅ Task Tracker
      </h1>

      {!user ? (
        <div className="bg-[#161b22] rounded-xl shadow-md p-6 w-full max-w-sm border border-[#30363d]">
          <h2 className="text-xl font-semibold mb-4 text-center capitalize">{authMode}</h2>
          <input
            className="w-full mb-3 px-4 py-2 rounded bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full mb-4 px-4 py-2 rounded bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded font-medium transition-all duration-200"
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
          <p className="text-sm text-center mt-3">
            {authMode === "login" ? "No account?" : "Already have one?"}{" "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="text-[#2f81f7] hover:underline"
            >
              {authMode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 animate-fade-in">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            <section className="flex items-center justify-around border border-[#30363d] rounded-xl p-4 bg-[#161b22]">
              <p>Welcome, <strong>{user.username}</strong></p>
              <div className="bg-[#238636] w-[100px] h-[100px] rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {tasks.length}
              </div>
            </section>

            <div className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-[#c9d1d9] focus:outline-none"
                placeholder="Enter a task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                onClick={handleAdd}
                className="bg-[#238636] hover:bg-[#2ea043] px-5 py-2 rounded text-white font-medium transition-all"
              >
                Add
              </button>
            </div>

            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-4 bg-[#161b22] rounded border border-[#30363d]"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id, task.completed)}
                      className="accent-[#2f81f7]"
                    />
                    <span className={`${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-400 hover:text-red-600 text-lg transition-all"
                    title="Delete"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-all duration-200 self-center mt-6"
            >
              Logout
            </button>
          </div>

          {/* Checklist Card */}
          <div className="w-full md:w-1/3 bg-[#161b22] p-6 rounded-xl border border-[#30363d]">
            <h3 className="text-2xl font-semibold mb-4 text-[#2f81f7]">📝 Checklist Summary</h3>
            <ul className="space-y-3 text-[#c9d1d9]">
              <li>Total tasks: {tasks.length}</li>
              <li>Completed: {completedTasks}</li>
              <li>Remaining: {tasks.length - completedTasks}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
