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
    const userId = req.user.userId;

    const { postData, postDetail } = req.body;

    const post = await prisma.post.create({
      data: {
        ...postData,
        userId,

        postDetail: {
          create: postDetail,
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  const { postData, postDetail } = req.body;

  try {
    const post = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...postData,
        postDetail: {
          update: postDetail,
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.code === "P2025" ? "Post not found" : error.message,
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {

  const id = req.params.id;
  try {
    await prisma.$transaction([
      prisma.postDetail.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);

    res.status(200).json({
      message: "Post deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.code === "P2025" ? "Post not found" : error.message,
    });
  }
};
