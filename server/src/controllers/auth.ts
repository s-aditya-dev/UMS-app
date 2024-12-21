import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import createError from "../utils/createError";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId, password } = req.body;

      // Validate input
      if (!loginId || !password) {
        return next(createError(400, "Email and password are required"));
      }

      // Find user
      const user = await User.findOne({
        $or: [{ email: loginId }, { username: loginId }],
      });

      if (!user) {
        return next(createError(404, "Invalid user or password"));
      }

      // Verify password
      const isValidPassword = (await user.password) == password;
      if (!isValidPassword) {
        return next(createError(401, "Invalid password"));
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      // Generate JWT token
      const token = jwt.sign(
        userWithoutPassword,
        process.env.JWT_SECRET || "",
        { expiresIn: "24h", algorithm: "HS256" }, // Explicitly specify algorithm
      );

      // Set token in cookie
      res.cookie("Access_Token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

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
    res.clearCookie("Access_Token", {
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
