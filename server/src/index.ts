import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DB_URI, FRONTEND_URL, PORT } from "./config/dotenv";

// Initialize express app
const app = express();

// MongoDB connection setup
mongoose.set("strictQuery", true);
const connectToDatabase = async () => {
  if (!DB_URI) {
    console.error("DB_URI is undefined. Please check your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // Frontend origin 1
  "http://localhost:5174", // Frontend origin 2
  FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express server!");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("An error occurred:", err.message);
  res.status(500).json({ error: "An internal error occurred" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed...");
  process.exit(0);
});

// Start server
const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Start the application
startServer();
