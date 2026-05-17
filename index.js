import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http"; // 👈 Socket ke liye zaroori hai

import { connectDB } from "./db/db.js";
import { initSocket } from "./socket/socket.js"; // 👈 Aapki naye socket file ka import

import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import chatRoute from "./routes/chatRoutes.js";
import messagesRoute from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app); // 👈 Express app ko HTTP server mein wrap kiya

const PORT = process.env.PORT || 5000;

// Initialize Socket.io (HTTP Server pass kiya)
initSocket(server);

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process?.env?.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
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

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany(); // Make sure prisma properly imported/initialized hai project mein
  res.json(posts);
});

// ⚠️ CRITICAL CHANGE: 'app.listen' ki jagah 'server.listen' use hoga
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
