import React, { useEffect, useState } from "react";
import { fetchMyReservations, cancelReservation } from "../api/reservations";

export default function Reservations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setList((s) => s.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message || "İptal edilemedi");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reservations-page">
      <h3>Rezervasyonlar</h3>
      <ul className="reservations-list">
        {list.map((r) => (
          <li key={r.id} className="reservation-item">
            <div>
              <strong>{r.name || r.guest || "Ben"}</strong> — Oda {r.room_number || r.room_id || r.room}
            </div>
            <div>
              {r.check_in || r.from} → {r.check_out || r.to}
            </div>
            <div>
              <button onClick={() => handleCancel(r.id)}>İptal Et</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
