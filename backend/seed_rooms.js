require('dotenv').config();
const db = require("./db");

const types = [
  { type: "Single", capacity: 1, image: "single.jpg", price: 4000 },
  { type: "Double", capacity: 2, image: "double.jpg", price: 5000 },
  { type: "Luxury", capacity: 2, image: "luxury.jpg", price: 6000 },
  { type: "Family", capacity: 4, image: "family.jpg", price: 7000 },
  { type: "Suite", capacity: 3, image: "suite.jpg", price: 10000 }
];

async function seedRooms() {
  try {
    for (let i = 0; i < types.length; i++) {
      const room = types[i];
      const room_number = 101 + i;

      await db.query(
        "INSERT INTO rooms (room_number, price, capacity, type, image) VALUES (?, ?, ?, ?, ?)",
        [room_number, room.price, room.capacity, room.type, room.image]
      );
      
      console.log(`Oda eklendi: ${room_number} - ${room.type} (Resim: ${room.image})`);
    }
  } catch (error) {
    console.log("\n Toplam 5 farklı oda tipi başarıyla oluşturuldu.");
    process.exit(0);
  };
};

seedRooms().catch(e => { console.error(e); process.exit(1); });
