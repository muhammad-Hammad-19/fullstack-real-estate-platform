import express from "express";

import {
  getPosts,
  getUsersPosts,
  getPostDetails, // <-- New detail controller dummy handler import kiya
  addPost,
  updatePost,
  deletePost,
} from "../controllers/postControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET ALL POSTS
router.get("/", authMiddleware, getPosts);

// GET SINGLE POST DETAILS (Specific dynamic route description)
// Note: Isko static ya sub-route constraints ke sath banna behtar hai taake direct generic /:id se conflict na kare
router.get("/:id/details", authMiddleware, getPostDetails);

// GET USERS ALL POSTS

router.get("/user/:id", authMiddleware, getUsersPosts);

// ADD NEW POST
router.post("/", authMiddleware, addPost);

// UPDATE POST
router.put("/:id", authMiddleware, updatePost);

// DELETE POST
router.delete("/:id", authMiddleware, deletePost);

export default router;
