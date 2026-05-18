import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Static ya specific sub-routes pehle aayenge
router.get("/", authMiddleware, getChats);
router.post("/", authMiddleware, addChat);
router.put("/read/:id", authMiddleware, readChat); // 👈 Isko dynamic id se UPAR hona chahiye

// 2. Dynamic ID waala route sabse aakhri mein aayega
router.get("/:id", authMiddleware, getChat); 

export default router;