import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
const loginServices = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const userId = user?.id;
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ email, password, userId }, process.env.JWT_SECRET);
    
    // 5. Return success response

    return {
      success: true,
      message: "Login successfull",
      userId,
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
