const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const reservationRoutes = require("./routes/reservations");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);

app.listen(4000, () => {
    console.log("Backend çalışıyor: http://localhost:4000");
});