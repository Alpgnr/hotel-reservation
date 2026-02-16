const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// creating reservation
router.post("/", auth, async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;

    // basic validation
    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({ error: "Eksik veri" });
    }

    if (new Date(check_in) >= new Date(check_out)) {
      return res.status(400).json({ error: "Giriş tarihi çıkış tarihinden önce olmalıdır" });
    }

    // preventing bookings for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(check_in);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ error: "Geçmiş bir tarihe rezervasyon yapılamaz" });
    }

    // ensure room exists
    const [roomRows] = await db.query("SELECT id FROM rooms WHERE id = ?", [room_id]);
    if (roomRows.length === 0) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    // preventing reservation conflict
    const [conflicts] = await db.query(
      `SELECT * FROM reservations 
      WHERE room_id = ? 
      AND status != 'cancelled'
      AND check_in < ?
      AND check_out > ?`,
      [room_id, check_out, check_in]
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

  } catch (error) {
    console.error("Rezervasyon hatası:", error);
    res.status(500).json({ error: "Rezervasyon oluşturulamadı." });
  }
});

// user reservations
router.get("/my", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, rooms.room_number
      FROM reservations r
      INNER JOIN rooms ON rooms.id = r.room_id
      WHERE r.user_id = ?`,
      [req.user.id]
    );

    res.json(rows);

  } catch (error) {
    console.error("Listeleme hatası:", error);
    res.status(500).json({ error: "Rezervasyonlar listelenemedi." });
  }
});

// cancel reservation
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM reservations WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rezervasyon bulunamadı" });
    }

    const reservation = rows[0];

    if (reservation.user_id !== req.user.id) {
      return res.status(403).json({ error: "Bu rezervasyonu iptal etme yetkiniz yok" });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: "Rezervasyon zaten iptal edilmiş" });
    }

    await db.query(
      "UPDATE reservations SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    res.json({ message: "Rezervasyon iptal edildi" });

  } catch (error) {
    console.error("İptal etme hatası:", error);
    res.status(500).json({ error: "İptal edilemedi." });
  }
});

module.exports = router;