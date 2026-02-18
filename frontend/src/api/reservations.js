import { getToken } from "./auth";
const Url = "http://localhost:4000";

export async function fetchMyReservations() {
  const token = getToken();
  if (!token) throw new Error("Yetkisiz");

  const res = await fetch(`${Url}/reservations/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Rezervasyonlar alınamadı");
  }

  return res.json();
}

export async function cancelReservation(id) {
  const token = getToken();
  if (!token) throw new Error("Yetkisiz");

  const res = await fetch(`${Url}/reservations/${id}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "İptal edilemedi");
  }

  return res.json();
}