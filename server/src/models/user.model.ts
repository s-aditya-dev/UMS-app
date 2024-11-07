import mongoose from "mongoose";
const { Schema } = mongoose;

export interface UserAccount {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string[];
  dob: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
}

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: [String], required: true }, // Default to empty array
  dob: { type: Date, default: Date.now }, // Default to current date
  email: { type: String },
  phone: { type: String },
  isLocked: { type: Boolean, default: false }, // Default to false
  permissions: { type: Object, default: {} }, // Default to empty object
});
export default mongoose.model("User", userSchema);
