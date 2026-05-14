import express from "express";

import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  savePost,
  unSavePost,
  getSavedPosts
} from "../controllers/postControllers.js";

const router = express.Router();

// GET ALL POSTS
router.get("/", getPosts);

// GET SINGLE POST
router.get("/:id", getPost);

// ADD NEW POST
router.post("/", addPost);

// UPDATE POST
router.put("/:id", updatePost);

// DELETE POST
router.delete("/:id", deletePost);

router.post("/save", savePost);

router.get("/saved", getSavedPosts);

router.delete("/save/:postId", unSavePost);

export default router;
