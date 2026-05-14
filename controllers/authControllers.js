import loginServices from "../services/loginServices.js";
import registerService from "../services/registerService..js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const { error } = registerSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.message });

    const result = await registerService(username, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    const { error } = loginSchema.validate({
      username,
      password,
    });
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // Login Service
    const result = await loginServices(username, password);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
      });
    }

    // Set Cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // localhost ke liye false
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Response
    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
      token: result.token,
      userId: result.userId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // same as login
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
