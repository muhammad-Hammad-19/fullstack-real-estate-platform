import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http"; 

import { connectDB } from "./db/db.js";
import { initSocket } from "./socket/socket.js"; 

import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import chatRoute from "./routes/chatRoutes.js";
import messagesRoute from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app); 
const PORT = process.env.PORT || 3000;

// 1. Middlewares (Hamesha pehle load karein)

app.use(cookieParser());
app.use(
  cors({
    origin: process?.env?.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// 2. Initialize Socket.io (Middlewares ke baad safe rehta hai)
initSocket(server);

// 3. Routes
app.use("/api/auth", authRoute);
app.use("/api/chats", chatRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/messages", messagesRoute);

// Database Connection
connectDB();

// Test HTTP Routes
app.get("/", (req, res) => {
  res.send("Hello World! API with Socket is running 🚀");
});

// ⚠️ Note: Ensure 'prisma' is imported if you are debugging this route directly here
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany(); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listen using HTTP server instance
server.listen(PORT, () => {
  console.log(`🚀 Single instance server running on port ${PORT}`);
});