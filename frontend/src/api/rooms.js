const Url = "http://localhost:4000";

export async function fetchRooms() {
  const res = await fetch(`${Url}/rooms`);
  if (!res.ok) throw new Error("Odalar alınamadı");
  return res.json();
}
