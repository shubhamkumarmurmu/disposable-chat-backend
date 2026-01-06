const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const http = require('http');
const port = process.env.PORT || 4000;
const app = require('./app');
const io = require('socket.io');

const server = http.createServer(app);

const socket = io(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

socket.on("connection", (client) => {
  console.log("New client connected");
  client.on("sentMessages", (message) => {
    console.log("Message received:", message);
    socket.emit("receivedMessage", message);
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
