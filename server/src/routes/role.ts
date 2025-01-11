import express from "express";
import RoleController from "../controllers/role";
import verifyToken from "../utils/jwt";

const router = express.Router();

// Create a new role
router.post("/", verifyToken, RoleController.createRole);

// Get all roles
router.get("/", verifyToken, RoleController.getRoles);

// Get role by ID
router.get("/:id", verifyToken, RoleController.getRole);

// Delete role by ID
router.delete("/:id", verifyToken, RoleController.deleteRole);

// Reorder role precedences (fix gaps)
router.post("/reorder", verifyToken, RoleController.reorderPrecedence);

// Bulk update role precedences
router.patch("/precedence", verifyToken, RoleController.updateRolePrecedences);

// Update Role
router.patch("/:id", verifyToken, RoleController.updateRole);

export default router;
