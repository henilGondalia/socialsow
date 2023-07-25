import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import chatRoutes from './routes/chat.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/post.js';
import { verifyToken } from './middleware/auth.js';
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import User from "./models/User.js";
// import Post from "./models/Post.js";
// import {users, posts} from "./data/index.js";

/* Configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
// app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* file storage */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* Routes with file */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* routes */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/chat', chatRoutes);

/*mongos setup */
const PORT = process.env.PORT || 6001;
const verifyUserToken = async (authorization) => {
  let token = authorization;
  if (!token) {
    return;
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trimLeft();
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(verified.id);
  return user;
}
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "https://socialsow.netlify.app",
        // origin: "http://localhost:3000",
      },
    })
    io.on("connection", (socket) => {
      console.log("Connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
      })

      socket.on("joinChat", (room) => {
        socket.join(room);
        console.log("user Join room:", room)
      })

      socket.on("typing", (room) => socket.in(room).emit("typing"))
      socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"))

      socket.on("newMessage", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("Chat user are not defined")

        chat.users.forEach(user => {
          if (user._id == newMessageRecieved.sender._id) return;
          socket.in(user._id).emit("messageRecieved", newMessageRecieved)
        });
      })

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(useData._id);
      })
    });
    /* Add dummy data */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
