require('dotenv').config();
const db = require("./db");

// second and third floor list
const newRooms = [
  { num: 201, type: "Single", capacity: 1, img: "single2.jpg", price: 4200 },
  { num: 202, type: "Double", capacity: 2, img: "double2.jpg", price: 6200 },
  { num: 203, type: "Luxury", capacity: 2, img: "luxury2.jpg", price: 8200 },
  { num: 204, type: "Family", capacity: 4, img: "family2.jpg", price: 7200 },
  { num: 205, type: "Suite", capacity: 3, img: "suite2.jpg", price: 10500 },
  { num: 301, type: "Single", capacity: 1, img: "single3.jpg", price: 4500 },
  { num: 302, type: "Double", capacity: 2, img: "double3.jpg", price: 6500 },
  { num: 303, type: "Luxury", capacity: 2, img: "luxury3.jpg", price: 8500 },
  { num: 304, type: "Family", capacity: 4, img: "family3.jpg", price: 7500 },
  { num: 305, type: "Suite", capacity: 3, img: "suite3.jpg", price: 11000 }
];

async function seedRoomsTwo() {
  try {
    for (const room of newRooms) {
      await db.query(
        "INSERT INTO rooms (room_number, price, capacity, type, image) VALUES (?, ?, ?, ?, ?)",
        [room.num, room.price, room.capacity, room.type, room.img]
      );
      console.log(`Eklendi: ${room.num} - ${room.type} - Resim: ${room.img}`);
    }

    console.log("\n Toplam 10 yeni oda eklendi.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error("\n Hata: Bu oda numaraları zaten veritabanında var.");
    } else {
      console.error("\n Hata oluştu:", error.message);
    }
    process.exit(1);
  }
}

seedRoomsTwo();