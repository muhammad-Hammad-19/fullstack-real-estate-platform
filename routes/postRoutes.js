import express from "express";

import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
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


export default router;