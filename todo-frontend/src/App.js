import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
import TaskPage from './pages/TaskPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <TaskPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="*"
        element={
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
