import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/:chatId", authMiddleware, addMessage);

export default router;
