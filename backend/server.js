require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Establish database connection
connectDB();

const PORT = process.env.PORT || 5003;

// Create HTTP Server for Socket.io integration
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected to realtime pipeline: ${socket.id}`);

  socket.on("workspace-update", (data) => {
    socket.broadcast.emit("workspace-alert", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Realtime Socket.io active`);
});
