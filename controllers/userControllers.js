import prisma from "../lib/prisma.js";

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
    console.log();

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

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: req.body,
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
