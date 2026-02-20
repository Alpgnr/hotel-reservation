require('dotenv').config();
const db = require("./db");

const types = [
  { type: "Single", capacity: 1, image: "single.jpg" },
  { type: "Double", capacity: 2, image: "double.jpg" },
  { type: "Luxury", capacity: 2, image: "luxury.jpg" },
  { type: "Family", capacity: 4, image: "family.jpg" },
  { type: "Suite", capacity: 3, image: "suite.jpg" }
];

async function seedRooms() {
  
  process.exit(0);
}

seedRooms().catch(e => { console.error(e); process.exit(1); });
