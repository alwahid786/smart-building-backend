import mongoose from "mongoose";
import { UserSchemaTypes } from "../../types/userTypes.js";


const userSchema = new mongoose.Schema<UserSchemaTypes>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
    },
    { timestamps: true }
);

export const User = mongoose.model<UserSchemaTypes>("User", userSchema);
