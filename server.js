// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Load routes
app.use("/auth", require("./src/API/tokenRoutes"));
app.use("/users", require("./src/API/usersRoutes"));
app.use("/minyans", require("./src/API/minyansRoutes"));
app.use("/notes", require("./src/API/notesRoutes"));
app.use("/daily_segments", require("./src/API/daily_segmentsRoutes"));
app.use("/saved_daily_segments", require("./src/API/saved_daily_segmentsRoutes"));
app.use("/prayers", require("./src/API/prayersRoutes"));
app.use("/geocode", require("./src/API/geocodeRoutes"));

app.get("/", (req, res) => {
  res.status(200).json("Final Project Server");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
