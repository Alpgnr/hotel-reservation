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
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [childrenAges, setChildrenAges] = useState([]);

  const adultsNum = adults === "" ? 0 : Math.min(10, Math.max(0, parseInt(adults, 10) || 0));
  const childrenNum = children === "" ? 0 : Math.min(10, Math.max(0, parseInt(children, 10) || 0));

  useEffect(() => {
    let mounted = true;
    fetchRooms()
      .then((data) => mounted && setRooms(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setChildrenAges(Array(childrenNum).fill("0-6"));
  }, [childrenNum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createReservation(roomId, checkIn, checkOut, adultsNum, childrenNum);
      setSuccess("Rezervasyon başarıyla oluşturuldu!");
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
      setAdults("");
      setChildren("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Hata");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Odalar yükleniyor...</div>;

  // Calculating total price
  function calculateTotal() {
    const room = rooms.find((r) => String(r.id) === String(roomId));
    if (!room || !checkIn || !checkOut) return 0;
    const price = room.price || room.rate || 0;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return 0;
    let total = adultsNum * price * nights;
    childrenAges.forEach((ageGroup) => {
      if (ageGroup === "0-6") return;
      if (ageGroup === "7-12") total += price * 0.5 * nights;
      if (ageGroup === "13+") total += price * nights;
    });
    return total;
  };

  return (
    <div className="bookroom-page">
      <h1 className="page-title">Yeni Rezervasyon</h1>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="room">Oda Seçin:</label>
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
          <label htmlFor="check_in">Giriş Tarihi:</label>
          <input
            id="check_in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="check_out">Çıkış Tarihi:</label>
          <input
            id="check_out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="adults">Yetişkin Sayısı:</label>
          <input
            id="adults"
            type="number"
            min="0"
            max="10"
            placeholder="0"
            value={adults}
            onChange={e => {
              const v = e.target.value;
              if (v === "") {
                setAdults("");
                return;
              }
              const digits = v.replace(/\D/g, "");
              const num = digits === "" ? "" : Math.min(10, parseInt(digits, 10));
              setAdults(num === "" ? "" : String(num));
            }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="children">Çocuk Sayısı:  </label>
            <input
              id="children"
              type="number"
              min="0"
              max="10"
              placeholder="0"
              value={children}
              onChange={e => {
                const v = e.target.value;
                if (v === "") {
                  setChildren("");
                  return;
                }
                const digits = v.replace(/\D/g, "");
                const num = digits === "" ? "" : Math.min(10, parseInt(digits, 10));
                setChildren(num === "" ? "" : String(num));
              }}
              style={{ width: 60 }}
            />
          </div>
          {childrenNum > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <label>Çocukların Yaşları:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Array.from({ length: childrenNum }).map((_, i) => (
                  <select
                    key={i}
                    value={childrenAges[i] || "0-6"}
                    onChange={e => {
                      const ages = [...childrenAges];
                      ages[i] = e.target.value;
                      setChildrenAges(ages);
                    }}
                    required
                    style={{ minWidth: 180 }}
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

        <div className="form-group">
          <strong>Toplam Fiyat: ₺{calculateTotal()}</strong>
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
