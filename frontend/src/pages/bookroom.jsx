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
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchRooms()
      .then((data) => mounted && setRooms(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setChildrenAges(Array(children).fill("0-6"));
  }, [children]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createReservation(roomId, checkIn, checkOut, adults, children);
      setSuccess("Rezervasyon başarıyla oluşturuldu!");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
      setAdults(1);
      setChildren(0);
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

        <div className="form-group">
          <label htmlFor="adults">Yetişkin Sayısı</label>
          <input
            id="adults"
            type="number"
            min="1"
            max="10"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <label htmlFor="children">Çocuk Sayısı</label>
            <input
              id="children"
              type="number"
              min="0"
              max="10"
              value={children}
              onChange={e => setChildren(Number(e.target.value))}
              required
              style={{ width: 60 }}
            />
          </div>
          {children > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label>Çocukların Yaşları</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: children }).map((_, i) => (
                  <select
                    key={i}
                    value={childrenAges[i] || "0-6"}
                    onChange={e => {
                      const ages = [...childrenAges];
                      ages[i] = e.target.value;
                      setChildrenAges(ages);
                    }}
                    required
                  >
                    <option value="0-6">0-6 yaş aralığı (ücretsiz)</option>
                    <option value="7-12">7-12 yaş aralığı (%50 indirimli fiyat)</option>
                    <option value="13+">12 yaş üstü (normal fiyat)</option>
                  </select>
                ))}
              </div>
            </div>
          )}
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
