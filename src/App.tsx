import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAdminAuthenticated');
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/*"
            element={isAuthenticated ? <Dashboard onLogout={() => handleLogin(false)} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
