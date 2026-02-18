import { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/login";
import Rooms from "./pages/rooms";
import Reservations from "./pages/reservations";
import BookRoom from "./pages/bookroom";
import { getToken, logout } from "./api/auth";

function Dashboard({ onLogout }) {
  const [view, setView] = useState("home");

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h2>Otel Rezervasyon Sistemi</h2>
        <nav className="dashboard-nav">
          <button onClick={() => setView("home")}>Ana Sayfa</button>
          <button onClick={() => setView("rooms")}>Odalar</button>
          <button onClick={() => setView("bookroom")}>Rezervasyon Yap</button>
          <button onClick={() => setView("reservations")}>Rezervasyonlar</button>
          <button onClick={onLogout} className="logout-btn">Çıkış</button>
        </nav>
      </header>

      <main className="dashboard-main">
        {view === "home" && (
          <div>
            <h3>Hoşgeldiniz - Yönetim Paneli</h3>
          </div>
        )}
        {view === "rooms" && <Rooms />}
        {view === "bookroom" && <BookRoom />}
        {view === "reservations" && <Reservations />}
      </main>
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

