import React, { useEffect, useState } from "react";
import { fetchRooms } from "../api/rooms";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchRooms()
      .then((data) => {
        if (mounted) setRooms(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Hata");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  if (loading) return <div className="loading-state">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page rooms-page">
      <h1 className="page-title">Odalar</h1>
      <div className="rooms-grid">
        {rooms.map((r) => (
          <div key={r.id} className="room-card">
            {r.image && (
              <img
                src={`/${r.image}`}
                alt={r.type || r.room_type || "Oda"}
                className="room-image"
              />
            )}
            <div className="room-id">{r.room_number || r.id}</div>
            <div className="room-type">{r.type || r.room_type || "—"}</div>
            <div className="room-price">₺{r.price || r.rate || "—"}/gece</div>
          </div>
        ))}
      </div>
    </div>
  );
}
