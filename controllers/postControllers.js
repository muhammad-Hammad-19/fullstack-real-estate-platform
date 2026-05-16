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
    // Middleware se logged-in user ki ID nikalenge
    const userId = req.user?.id || req.user?.userId;
    
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated!" });
    }

    // Database se sirf is user ki saari posts find karenge
    const posts = await prisma.post.findMany({
      where: {
        userId: userId, // Sirf wahi posts aayengi jinki userId logged-in user se match karegi
      },
      include: {
        postDetail: true, // Agar details chahiye toh
      },
      orderBy: {
        createdAt: "desc", // Newest posts pehle dikhane ke liye
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
