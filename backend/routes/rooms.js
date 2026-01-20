const express = require("express");
const db = require("../db");

const router = express.Router();

// all rooms
router.get("/", async (req, res) => {
  const [rooms] = await db.query("SELECT * FROM rooms");
  res.json(rooms);
});

module.exports = router;