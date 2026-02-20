const db = require("./db");

const types = ["Single", "Double", "Luxury", "Family"];

async function seedRooms() {
  for (let i = 1; i <= 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const price = 80 + Math.floor(Math.random() * 120);
    const room_number = 100 + i;
    await db.query(
      "INSERT INTO rooms (room_number, type, price) VALUES (?, ?, ?)",
      [room_number, type, price]
    );
    console.log(`Oda eklendi: ${room_number} - ${type} - ₺${price}`);
  }
  process.exit(0);
}

seedRooms().catch(e => { console.error(e); process.exit(1); });
