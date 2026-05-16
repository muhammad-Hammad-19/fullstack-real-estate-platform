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
export const getUsersPosts = async (req, res) => {
  try {
    // URL param (:id) se uthayenge, agar wo na ho toh logged-in user ki token ID use karenge
    const userId = req.params.id || req.user?.id || req.user?.userId;
    
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User identity verify nahi ho saki!" });
    }

    // Database se sirf IS user ki posts find karenge
    const posts = await prisma.post.findMany({
      where: {
        userId: userId, 
      },
      include: {
        postDetail: true, 
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get User Posts Error:", error);
    res.status(500).json({
      success: false,
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
export const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID is required!" });
    }

    // 1. Pehle simple query se post aur postDetail nikalen bina direct required relation crash ke
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        postDetail: true,
        // Agar schema strict hai, toh relation yahan fetch karne par crash karega agar user null ho
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post nahi mili!" });
    }

    // 2. Ab safely user ki details fetch karenge agar post ke paas userId maujood hai
    let userData = null;
    if (post.userId) {
      userData = await prisma.user.findUnique({
        where: { id: post.userId },
        select: {
          username: true,
          avatar: true,
        },
      });
    }

    // 3. Dono data ko combine karke frontend ko bhejenge
    res.status(200).json({
      success: true,
      data: {
        ...post,
        user: userData || { username: "Unknown User", avatar: "" }, // Fallback safe object
      },
    });
  } catch (error) {
    console.error("Get Post Details Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
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
