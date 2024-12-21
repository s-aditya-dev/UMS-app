import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "../utils/createError";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies instead of headers
    const token = req.cookies.Access_Token;

    if (!token) {
      return next(createError(401, "Access denied. No token provided"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, "Invalid token"));
  }
};

export default verifyToken;
