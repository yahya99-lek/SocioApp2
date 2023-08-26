// const http = require('http');
// const express = require('express');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // handle WebSocket Connection
// io.on('connection', (socket) => {
//     console.log('New user connected:', socket.id);

//     // Handle incoming messages
//     socket.on('message', (message) =>{
//         // save the message in the database
//         // Broadcast the message to all connected users
//         io.emit('message', message); 
//     });
//     // handle user disconnection
//     socket.on("disconnect", ()=>{
//         console.log('User disconnected:', socket.id);
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(`server is runnig on port ${PORT}`);
// })
const io = require("socket.io-client");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("message", (message) => {
  console.log("Received message:", message);
});
