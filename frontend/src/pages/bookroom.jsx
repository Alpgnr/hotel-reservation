import React, { useEffect, useState } from "react";
import { fetchRooms } from "../api/rooms";
import { createReservation } from "../api/reservations";

export default function BookRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchRooms()
      .then((data) => mounted && setRooms(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createReservation(roomId, checkIn, checkOut);
      setSuccess("Rezervasyon başarıyla oluşturuldu!");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Hata");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page">Odalar yükleniyor...</div>;

  return (
    <div className="bookroom-page">
      <h3>Yeni Rezervasyon</h3>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="room">Oda Seçin</label>
          <select
            id="room"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            <option value="">— Seçiniz —</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                Oda {r.room_number || r.id} — {r.type || "—"} (₺{r.price || r.rate || "—"}/gece)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="check_in">Giriş Tarihi</label>
          <input
            id="check_in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="check_out">Çıkış Tarihi</label>
          <input
            id="check_out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Rezervasyon Yapılıyor..." : "Rezervasyon Yap"}
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}
