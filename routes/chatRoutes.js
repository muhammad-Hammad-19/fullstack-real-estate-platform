import express from "express";
import {
  getChat,
  getChats,
  addChat,
  readChat,
} from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getChats);
router.post("/", authMiddleware, addChat);
router.get("/:id", authMiddleware, getChat);
router.put("/read/:id", authMiddleware, readChat);

export default router;
