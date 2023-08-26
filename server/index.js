import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import multer from 'multer'; 
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js";
import {register} from './controllers/auth.js';
import {createPost} from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import Message from './models/Message.js'; // Import the Message model 
import { users,posts } from './data/index.js';
import { Server } from 'socket.io';
import http from 'http';



/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server,
  {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
  });
// io.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST","PATCH"],
    credentials: true
  }));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/messages",messageRoutes);

/* Socket Server */

// handle WebSocket Connection

const activeUsers = new Map(); // Use a Map to store user IDs and names
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle joining a room based on the userId
  socket.on('join', ({ userId, userName }) => {
    socket.join(userId);
    activeUsers.set(userId, userName); // Add the user to the active users list
    io.emit('activeUsers', Array.from(activeUsers.values()));
  });

  // Handle leaving a room based on the userId
  socket.on('leave', ({ userId }) => {
    socket.leave(userId);
    activeUsers.delete(userId); // Remove the user from the active users list
    io.emit('activeUsers',Array.from(activeUsers.values())) ; // Broadcast the updated list of active users
  });
  
  // Handle incoming messages
  socket.on('message', async (message) =>{
      // save the message in the database
    const newMessage = {
      senderId: message.senderId,
      receiverId: message.receiverId,
      messageContent: message.messageContent,
    };
      // Broadcast the message to all connected users
      try {
        await newMessage.save();
        // Broadcast the message to all connected users
        io.to(message.senderId).emit('message', message);
        io.to(message.receiverId).emit('message', message);
      } catch (error) {
        console.error('An error occurred while saving the message:', error);
      }
      console.log(newMessage);
    });

  
  // handle user disconnection
  socket.on("disconnect", ()=>{
      console.log('User disconnected:', socket.id);
      activeUsers.delete(socket.id);// Remove the user from the active users list
      io.emit('activeUsers',Array.from(activeUsers.values()) );
  });
});


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
