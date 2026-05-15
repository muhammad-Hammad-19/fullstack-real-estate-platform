import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.email;

    const users = await prisma.user.findMany({
      where: {
        email: {
          not: loggedInUserId,
        },
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// UPDATE USER

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = { ...req.body };

    // agar password aaya hai to usko hash karo
    if (data.password && data.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.code === "P2025" ? "User not found" : err.message,
    });
  }
};
// DELETE USER

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.code === "P2025" ? "User not found" : err.message,
    });
  }
};

export const savePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const saved = await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Post saved",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: true,
      },
    });

    res.status(200).json({
      success: true,
      data: savedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
