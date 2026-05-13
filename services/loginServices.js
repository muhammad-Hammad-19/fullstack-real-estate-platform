import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginServices = async (email, password) => {
  try {
    const users = await User.find({ email });

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);

    
    // 5. Return success response

    return {
      success: true,
      message: "Login successfull",
      userId: user,
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
