import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  savePost,
  getSavedPosts
} from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);``
router.delete("/:id", authMiddleware, deleteUser);

router.post("/save", savePost); 

router.get("/saved", getSavedPosts);

export default router;
