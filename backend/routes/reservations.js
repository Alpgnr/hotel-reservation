const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// creating reservation
router.post("/", auth, async (req, res) => {
  const { room_id, check_in, check_out } = req.body;

  // basic validation
  if (!room_id || !check_in || !check_out) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  if (new Date(check_in) >= new Date(check_out)) {
    return res.status(400).json({ error: "Giriş tarihi çıkış tarihinden önce olmalıdır" });
  }

  // preventing reservation conflict
  const [conflicts] = await db.query(
    `SELECT * FROM reservations 
     WHERE room_id = ? 
     AND status != 'cancelled'
     AND (
       (check_in < ? AND check_out > ?) OR
       (check_in >= ? AND check_in < ?) OR
       (check_out > ? AND check_out <= ?)
     )`,
    [room_id, check_out, check_in, check_in, check_out, check_in, check_out]
  );

  if (conflicts.length > 0) {
    return res.status(409).json({ error: "Bu tarihler için oda dolu" });
  }

  await db.query(
    `INSERT INTO reservations (user_id, room_id, check_in, check_out, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [req.user.id, room_id, check_in, check_out]
  );

  res.json({ message: "Rezervasyon oluşturuldu" });
});

// user reservations
router.get("/my", auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT r.*, rooms.room_number
     FROM reservations r
     INNER JOIN rooms ON rooms.id = r.room_id
     WHERE r.user_id = ?`,
    [req.user.id]
  );

  res.json(rows);
});

module.exports = router;