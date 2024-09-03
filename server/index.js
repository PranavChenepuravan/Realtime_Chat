const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());

// Create the HTTP server before using it with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Listen for a connection event
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (data)=>{
    socket.join(data)
    console.log(`User with ID : ${socket.id} joined room:${data}`)
  })

  socket.on("send_message",(data)=>{
    socket.to(data.room).emit("receive_message",data)
  })

  // Listen for the disconnect event on the socket instance
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server Running on port 3001");
});
