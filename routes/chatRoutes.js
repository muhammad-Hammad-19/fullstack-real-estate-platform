import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getChats);

router.get("/:id", authMiddleware, getChat);

router.post("/", authMiddleware, addChat);

router.put("/read/:id", authMiddleware, readChat);

export default router;
