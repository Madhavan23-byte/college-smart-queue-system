const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  res.send("College Smart Queue Backend API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`College Smart Queue Backend running on http://localhost:${PORT}`);
});