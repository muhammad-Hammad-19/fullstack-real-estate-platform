import express from "express";
import { addMessage } from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:chatId", authMiddleware, addMessage);

export default router;
