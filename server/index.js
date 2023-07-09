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
import {register} from './controllers/auth.js';
import {createPost} from './controllers/post.js';
import { verifyToken } from './middleware/auth.js';
import WebSocket, { WebSocketServer }  from "ws";
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
app.post('/posts',verifyToken, upload.single('picture'), createPost);

/* routes */
app.use('/auth', authRoutes);
app.use('/users',userRoutes);
app.use('/posts',postRoutes);
app.use('/chat',chatRoutes);

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
    const wss = new WebSocketServer({server})
    wss.on('connection', async(socket, req) => {
      const encodedHeaders = req.url.split('/')[1];
      const headers = JSON.parse(atob(encodedHeaders));
      const user = await verifyUserToken(headers['Authorization']);
      // console.log(user);
      if(user){
        socket.userId = user._id;
        socket.userName = `${user.firstName} ${user.lastName}`;
        [...wss.clients].forEach(client => {
          client.send(JSON.stringify(
            [...wss.clients].map((c) => {return { userId: c.userId, userName: c.userName }})
          ))
        })
      }else {
        socket.close(403, 'Access Denied');
        return;
      }
    });

    /* Add dummy data */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
