// src/config/dotenv.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI = process.env.MONGO;
export const JWT_SECRET = "rudra1210";
export const FRONTEND_URL = "http://localhost:5173";
export const BACKEND_URL = `http://localhost:${PORT}`;
