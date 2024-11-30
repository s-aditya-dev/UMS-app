import express from "express";
import UserController from "../controllers/user";

const router = express.Router();

// Create a new user
router.post("/", UserController.createUser);

// Get all users
router.get("/", UserController.getAllUsers);

// Get user by ID
router.get("/:id", UserController.getUserById);

// Update user
router.patch("/:id", UserController.updateUser);

// Change password
router.patch("/:id/password", UserController.changePassword);

// Delete user
router.delete("/:id", UserController.deleteUser);

export default router;
