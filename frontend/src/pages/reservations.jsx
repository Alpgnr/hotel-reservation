import React, { useEffect, useState } from "react";
import { fetchMyReservations, cancelReservation } from "../api/reservations";

export default function Reservations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("tr-TR");
  };

  useEffect(() => {
    let mounted = true;
    fetchMyReservations()
      .then((data) => mounted && setList(data))
      .catch((err) => mounted && setError(err.message || "Hata"))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      setList((s) =>
        s.map((r) =>
          r.id === id ? { ...r, status: "cancelled" } : r
        )
      );
    } catch (err) {
      setError(err.message || "İptal edilemedi");
    }
  };

  if (loading) return <div className="loading-state">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reservations-page">
      <h1 className="page-title">Rezervasyonlar</h1>
      <ul className="reservations-list">
        {list.map((r) => (
          <li key={r.id} className="reservation-item">
            <div>
              <strong>Oda {r.room_number}</strong>
            </div>
            <div>
              {formatDate(r.check_in)} → {formatDate(r.check_out)}
            </div>
            <div>
              <span className={`reservation-status ${r.status === "cancelled" ? "cancelled" : "full"}`}>
                {r.status === "cancelled" ? "İptal" : "Dolu"}
              </span>
            </div>
            {r.status !== "cancelled" && (
              <button type="button" className="reservation-cancel-btn" onClick={() => handleCancel(r.id)}>
                İptal Et
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}