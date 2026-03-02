import React, { useEffect, useState } from "react";
import { fetchRooms } from "../api/rooms";

function checkOverlap(selectIn, selectOut, resIn, resOut) {
  if (!selectIn || !selectOut || !resIn || !resOut) return false;
  
  const sIn = new Date(selectIn).getTime();
  const sOut = new Date(selectOut).getTime();
  const rIn = new Date(resIn).getTime();
  const rOut = new Date(resOut).getTime();

  return sIn < rOut && sOut > rIn;
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchRooms()
      .then((data) => {
        if (mounted) {
          console.log("Gelen Veri:", data);
          setRooms(data);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Hata");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-main rooms-page">
      <h1 className="page-title">Otel Odaları</h1>
      
      <div className="room-date-filter">
        <label>
          📅 Giriş Tarihi
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        </label>
        <label>
          📅 Çıkış Tarihi
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        </label>
      </div>

      <div className="rooms-grid">
        {rooms.map((r) => {
          const isOccupied = checkIn && checkOut && r.reservations?.some(res => 
            checkOverlap(checkIn, checkOut, res.check_in, res.check_out)
          );

          return (
            <div key={r.id} className={`room-card ${isOccupied ? "booked" : ""}`}>
              {r.image && <img src={`/${r.image}`} alt={r.type} className="room-image" />}
              
              <div className="room-details-card">
                <div className="room-id">Oda {r.room_number}</div>
                <div className="room-type">{r.type}</div>
                <div className="room-price">₺{r.price} <small>/gece</small></div>
                
                <div className={`status-tag ${isOccupied ? "red" : "green"}`}>
                  {isOccupied ? "DOLU" : "BOŞ"}
                </div>

                {r.reservations?.length > 0 && (
                  <div className="all-dates">
                    <small>Kayıtlı Rezervasyonlar</small>
                    <ul>
                      {r.reservations.slice(0, 2).map(res => (
                        <li key={res.id}>
                          {new Date(res.check_in).toLocaleDateString("tr-TR", {day:'numeric', month:'short'})} - {new Date(res.check_out).toLocaleDateString("tr-TR", {day:'numeric', month:'short'})}
                        </li>
                      ))}
                      {r.reservations.length > 2 && <li className="more-dates">+{r.reservations.length - 2} kayıt daha</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}