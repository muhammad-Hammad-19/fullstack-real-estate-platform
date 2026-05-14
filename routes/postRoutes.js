import express from "express";

import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} from "../controllers/postControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET ALL POSTS
router.get("/", getPosts);

// GET SINGLE POST
router.get("/:id", getPost);

// ADD NEW POST
router.post("/", authMiddleware, addPost);

// UPDATE POST
router.put("/:id", authMiddleware, updatePost);

// DELETE POST
router.delete("/:id", authMiddleware, deletePost);

export default router;
