import mongoose, { Schema, Document } from "mongoose";

export interface AuditLog extends Document {
  action: "create" | "update" | "delete";
  entity: string; // Entity affected (e.g., "Users", "Task")
  performedBy: {
    userId: string;
    username: string;
    roles?: string[];
  };
  timestamp: Date;
}

const AuditLogSchema = new Schema<AuditLog>(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    entity: { type: String, required: true },
    performedBy: {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      roles: { type: [String] },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// **Adding Indexes**
AuditLogSchema.index({ entity: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ timestamp: -1 });

export default mongoose.model<AuditLog>("AuditLog", AuditLogSchema);
