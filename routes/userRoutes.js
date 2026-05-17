import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  savePost,
  getSavedPosts,
  getNotificationNumber,
} from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ─── 1. STATIC & SPECIFIC ROUTES (HAMESHA SABSE UPAR) ───
router.get("/", authMiddleware, getAllUsers);
router.post("/save", authMiddleware, savePost);
router.get("/savedPosts", authMiddleware, getSavedPosts);

// 🔥 notification ko yahan upar hona chahiye taake Express ise id na samjhe!
router.get("/notification", authMiddleware, getNotificationNumber); 


// ─── 2. DYNAMIC PARAMETER ROUTES (HAMESHA SABSE NEECHE) ───
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;