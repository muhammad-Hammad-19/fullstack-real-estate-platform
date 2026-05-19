import express from "express";
import { login, logout, register } from "../controllers/authControllers.js";
import protectMiddleware from "../middlewares/protectMiddleware.js";
const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/check", protectMiddleware);

authRouter.post("/logout", logout);

export default authRouter;
