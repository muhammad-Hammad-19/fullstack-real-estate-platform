import mongoose from "mongoose";
import dotenv from "dotenv";

// Load `.env` from the backend folder (local development).
dotenv.config();

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI);
  }

  try {
    const conn = await connectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    connectionPromise = undefined;
    throw error;
  }
};
