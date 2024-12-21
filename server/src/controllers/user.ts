import { NextFunction, Request, Response } from "express";
import User, { UserAccount } from "../models/user"; // Adjust import path as needed
import createError from "../utils/createError"; // Import the createError function

class UserController {
  // Create a new user
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        username,
        password,
        firstName,
        lastName,
        roles,
        email,
        phone,
        dob,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return next(createError(400, "Username already exists"));
      }

      // Create new user
      const newUser = new User({
        username,
        password,
        firstName,
        lastName,
        roles,
        email,
        phone,
        dob,
        isLocked: false,
        permissions: {},
        settings: { isPassChange: false },
      });

      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        userId: newUser._id,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error creating user",
        ),
      );
    }
  }

  // Get all users (with optional filtering)
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const query = role ? { roles: role as string } : {};

      const users = await User.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const total = await User.countDocuments(query);

      res.status(200).json({
        users,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalUsers: total,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching users",
        ),
      );
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(createError(404, "User not found"));
      }

      res.status(200).json(user);
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching user",
        ),
      );
    }
  }

  // Update user
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        roles,
        dob,
        permissions,
        settings,
      } = req.body;

      // Prevent updating certain fields
      const updateData: Partial<UserAccount> = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (roles) updateData.roles = roles;
      if (dob) updateData.dob = dob;
      if (permissions) updateData.permissions = permissions;
      if (settings) updateData.settings = settings;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, select: "-password" },
      );

      if (!updatedUser) {
        return next(createError(404, "User not found"));
      }

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error updating user",
        ),
      );
    }
  }

  // Change password
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword, isPassChange = true } = req.body;

      // Find user by ID
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(createError(404, "User not found"));
      }

      // Verify current password
      const isMatch = currentPassword === user.password;
      if (!isMatch) {
        return next(createError(400, "Current password is incorrect"));
      }

      // Update password and reset password change flag
      user.password = newPassword;
      user.settings = { isPassChange: isPassChange };
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error changing password",
        ),
      );
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return next(createError(404, "User not found"));
      }

      res.status(200).json({
        message: "User deleted successfully",
        userId: deletedUser._id,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error deleting user",
        ),
      );
    }
  }
}

export default new UserController();
