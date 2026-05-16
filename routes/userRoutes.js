import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  savePost,
  getSavedPosts,
} from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Static aur Specific Actions (Hamesha Upar) 🔝
router.get("/", authMiddleware, getAllUsers);
router.post("/save", authMiddleware, savePost);
router.get("/savedPosts", authMiddleware, getSavedPosts); // 🔥 Ab yeh sahi hit hoga!

// 2. Dynamic ID waale routes (Hamesha Sabse Neeche) ⬇️

router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
