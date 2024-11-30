import express from "express";
import { login, logout } from "../controllers/auth";

const router = express.Router();

// Login user
router.post("/login", login);

// Logout user
router.post("/logout", logout);

export default router;
