import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const loginServices = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return {
      success: true,
      message: "Login successfull",
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export default loginServices;
