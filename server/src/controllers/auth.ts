import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/dotenv";
import User, { UserAccount } from "../models/user";
import createError from "../utils/createError";

// Helper function to create a JWT token
const createToken = (user: UserAccount): string => {
  return jwt.sign(
    {
      username: user.username,
      role: user.roles,
    },
    JWT_SECRET,
    { expiresIn: "5h" },
  );
};

// Login function
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "User not found"));

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(createError(400, "Invalid credentials"));

    // Create JWT token
    let token = null;
    if (user.username && user.roles) token = createToken(user);
    if (!token) return next(createError(400, "Invalid user datatype"));
    // Send response with token as httpOnly cookie
    const { password: _, ...userInfo } = user.toObject(); // Exclude password from response
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "strict",
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    next(err);
  }
};

// Logout function
export const logout = (req: Request, res: Response): void => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .send("User has been logged out");
};
