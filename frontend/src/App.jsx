import { useState, useEffect } from "react";
import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import Home from "./pages/home";
import Rooms from "./pages/rooms";
import Reservations from "./pages/reservations";
import BookRoom from "./pages/bookroom";
import { getToken, logout } from "./api/auth";

function DashboardLayout({ onLogout }) {
  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h2>Otel Rezervasyon Sistemi</h2>
        <nav className="dashboard-nav">
          <NavLink to="/" end>Ana Sayfa</NavLink>
          <NavLink to="/rooms">Odalar</NavLink>
          <NavLink to="/bookroom">Rezervasyon Yap</NavLink>
          <NavLink to="/reservations">Rezervasyonlar</NavLink>
          <button type="button" onClick={onLogout} className="logout-btn">Çıkış</button>
        </nav>
      </header>
      <main className="dashboard-main">
        <Outlet />
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
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            authenticated ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="bookroom" element={<BookRoom />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>
        <Route path="*" element={<Navigate to={authenticated ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;

