import prisma from "../lib/prisma.js";

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE POST
export const addPost = async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: req.body,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {

  try {
    const post = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message:
        error.code === "P2025"
          ? "Post not found"
          : error.message,
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    await prisma.post.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.code === "P2025"
          ? "Post not found"
          : error.message,
    });
  }
};