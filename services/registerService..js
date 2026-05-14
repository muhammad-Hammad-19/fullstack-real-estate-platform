import prisma from "../lib/prisma.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerService = async (name, email, password) => {
  
  // 1. Check if email already exists
  const isEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (isEmail) {
    throw new Error("Email already exists");
  }

  // 2. Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  // 4. Return user (without password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export default registerService;