import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Role from "../models/role";
import User from "../models/user";
import createError from "../utils/createError";

interface PrecedenceUpdate {
  _id: string;
  precedence: number;
}

class RoleController {
  // Create a new role
  async createRole(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { name, permissions, createdBy } = req.body;

      const existingRole = await Role.findOne({ name }).session(session);
      if (existingRole) {
        await session.abortTransaction();
        return next(createError(400, "Role with this name already exists"));
      }

      // Get the last precedence number
      const lastPrecedenceRole = await Role.findOne({})
        .sort({ precedence: -1 })
        .session(session);

      const newPrecedence = lastPrecedenceRole
        ? lastPrecedenceRole.precedence + 1
        : 1;

      const role = new Role({
        name,
        precedence: newPrecedence,
        permissions,
        createdBy,
        updatedBy: createdBy,
      });

      await role.save({ session });
      await session.commitTransaction();

      res.status(201).json({
        message: "Role created successfully",
        role,
      });
    } catch (error) {
      await session.abortTransaction();
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error creating role",
        ),
      );
    } finally {
      session.endSession();
    }
  }

  // Delete role and remove it from all users
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const role = await Role.findById(req.params.id).session(session);
      if (!role) {
        await session.abortTransaction();
        return next(createError(404, "Role not found"));
      }

      // Get the precedence of the role being deleted
      const deletedPrecedence = role.precedence;

      // Remove role from all users who have it
      await User.updateMany(
        { roles: role.name },
        { $pull: { roles: role.name } },
        { session },
      );

      // Update precedence of all roles with higher precedence
      await Role.updateMany(
        { precedence: { $gt: deletedPrecedence } },
        { $inc: { precedence: -1 } },
        { session },
      );

      // Delete the role
      await Role.findByIdAndDelete(req.params.id).session(session);

      await session.commitTransaction();
      res.status(200).json({
        message: `Role ${role.name} deleted and removed from all users. Precedences updated.`,
      });
    } catch (error) {
      await session.abortTransaction();
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error deleting role",
        ),
      );
    } finally {
      session.endSession();
    }
  }

  // Get all roles sorted by precedence
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.find({}).sort({ precedence: 1 });
      res.status(200).json({ roles });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching roles",
        ),
      );
    }
  }

  // Get single role by ID
  async getRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return next(createError(404, "Role not found"));
      }
      res.status(200).json({ role });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching role",
        ),
      );
    }
  }

  // Optional: Add method to fix gaps in precedence if needed
  async reorderPrecedence(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Get all roles ordered by precedence
      const roles = await Role.find({})
        .sort({ precedence: 1 })
        .session(session);

      // Reassign precedence values to ensure they are sequential
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        role.precedence = i + 1;
        await role.save({ session });
      }

      await session.commitTransaction();
      res.status(200).json({
        message: "Role precedences reordered successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(
        createError(
          500,
          error instanceof Error
            ? error.message
            : "Error reordering precedences",
        ),
      );
    } finally {
      session.endSession();
    }
  }

  // Bulk update role precedences
  async updateRolePrecedences(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const updates: PrecedenceUpdate[] = req.body.updates;

      // Validate input array
      if (!Array.isArray(updates) || updates.length === 0) {
        await session.abortTransaction();
        return next(
          createError(
            400,
            "Invalid input: Expected non-empty array of updates",
          ),
        );
      }

      // Validate that all IDs are valid MongoDB ObjectIds
      const areValidIds = updates.every((update) =>
        mongoose.Types.ObjectId.isValid(update._id),
      );

      if (!areValidIds) {
        await session.abortTransaction();
        return next(
          createError(400, "Invalid input: One or more invalid role IDs"),
        );
      }

      // Validate that precedence values are unique
      const precedences = updates.map((u) => u.precedence);
      if (new Set(precedences).size !== precedences.length) {
        await session.abortTransaction();
        return next(
          createError(400, "Invalid input: Precedence values must be unique"),
        );
      }

      // Get all roles that are being updated
      const roleIds = updates.map((update) => update._id);
      const existingRoles = await Role.find({ _id: { $in: roleIds } }).session(
        session,
      );

      // Verify all roles exist
      if (existingRoles.length !== updates.length) {
        await session.abortTransaction();
        return next(createError(404, "One or more roles not found"));
      }

      // Perform all updates
      const updatePromises = updates.map((update) =>
        Role.findByIdAndUpdate(
          update._id,
          { precedence: update.precedence },
          { new: true, session },
        ),
      );

      const updatedRoles = await Promise.all(updatePromises);

      await session.commitTransaction();

      res.status(200).json({
        message: "Role precedences updated successfully",
        roles: updatedRoles,
      });
    } catch (error) {
      await session.abortTransaction();
      next(
        createError(
          500,
          error instanceof Error
            ? error.message
            : "Error updating role precedences",
        ),
      );
    } finally {
      session.endSession();
    }
  }

  // Update an existing role
  async updateRole(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { name, permissions, updatedBy } = req.body;
      const roleId = req.params.id;

      // Find the role to update
      const role = await Role.findById(roleId).session(session);
      if (!role) {
        await session.abortTransaction();
        return next(createError(404, "Role not found"));
      }

      // If name is being updated, check if new name already exists
      if (name && name !== role.name) {
        const existingRole = await Role.findOne({ name }).session(session);
        if (existingRole) {
          await session.abortTransaction();
          return next(createError(400, "Role with this name already exists"));
        }

        // Update the role name in all users who have this role
        await User.updateMany(
          { roles: role.name },
          { $set: { "roles.$": name } },
          { session },
        );
      }

      // Update the role
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        {
          ...(name && { name }),
          ...(permissions && { permissions }),
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true, session },
      );

      await session.commitTransaction();

      res.status(200).json({
        message: "Role updated successfully",
        role: updatedRole,
      });
    } catch (error) {
      await session.abortTransaction();
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error updating role",
        ),
      );
    } finally {
      session.endSession();
    }
  }
}

export default new RoleController();
