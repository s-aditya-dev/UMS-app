import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import createError from "../utils/createError";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return next(createError(400, "Email and password are required"));
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return next(createError(404, "User not found"));
      }

      // Verify password
      const isValidPassword = (await user.password) == password;
      if (!isValidPassword) {
        return next(createError(401, "Invalid password"));
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "24h" },
      );

      // Set token in cookie
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      // Send response
      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    // Clear the access token cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
}

export default new AuthController();
