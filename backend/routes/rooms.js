const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // select all rooms and their rezervations that are not cancelled
    const [rows] = await db.query(`
      SELECT 
        r.*, 
        res.id AS res_id, 
        res.check_in, 
        res.check_out, 
        res.status AS res_status
      FROM rooms r
      LEFT JOIN reservations res ON r.id = res.room_id 
      AND res.status != 'cancelled'
      ORDER BY r.room_number ASC
    `);

    const roomsMap = {};
    rows.forEach(row => {
      if (!roomsMap[row.id]) {
        roomsMap[row.id] = {
          ...row,
          reservations: []
        };
      }

      // add to the array if there is a reservation
      if (row.res_id) {
        roomsMap[row.id].reservations.push({
          id: row.res_id,
          check_in: row.check_in,
          check_out: row.check_out,
          status: row.res_status
        });
      }
    });

    const finalData = Object.values(roomsMap);
    console.log("Backend'den giden veri örneği:", finalData[0]);
    res.json(finalData);

  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Odalar yüklenemedi" });
  }
});

module.exports = router;