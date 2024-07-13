import mongoose from "mongoose";
import { UserTypes } from "../../types/userTypes.js";

const authSchema = new mongoose.Schema<UserTypes>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String }, // Optional field for profile picture
    phoneNumber: { type: String, required: true }, // Store phone number as string
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export const Auth = mongoose.model<UserTypes>("Auth", authSchema);
