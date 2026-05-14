import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const registerService = async (username, email, password) => {
  
  // check email
  const isEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (isEmail) {
    throw new Error("Email already exists");
  }

  // check username
  const isUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (isUsername) {
    throw new Error("Username already exists");
  }

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export default registerService;
