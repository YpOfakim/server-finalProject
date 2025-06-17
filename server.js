require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }, // מאפשר חיבורים מכל מקום
});
app.use(cors());

app.use(express.json()); // מאפשר שליחת JSON בבקשות
app.use("/users", require("./src/API/usersRoutes"));
// app.use("/minyans", require("./src/API/postsRoutes"));
app.use("/notes", require("./src/API/notesRoutes"));
app.use("/daily_segments", require("./src/API/daily_segmentsRoutes"));
app.use("/saved_daily_segments", require("./src/API/saved_daily_segmentsRoutes"));

app.get("", (req, res) => {
    return res.status(200).json("Final Project Server");
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  