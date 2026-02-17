import { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/login";
import { getToken, logout } from "./api/auth";

function Dashboard({ onLogout }) {
  return (
    <div>
      <h2>Panel</h2>
      <p>Hoşgeldiniz.</p>
      <button onClick={onLogout}>Çıkış Yap</button>
    </div>
  );
}

function App() {
  const [authenticated, setAuthentication] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthentication(!!token);
  }, []);

  const handleLogin = () => setAuthentication(true);
  const handleLogout = () => {
    logout();
    setAuthentication(false);
  };

  return (
    <div className="app-root">
      {authenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

