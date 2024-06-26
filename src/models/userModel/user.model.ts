import mongoose from "mongoose";
import { UserTypeBody } from "../../types/userTypes.js";

// user schema
const userSchema = new mongoose.Schema<UserTypeBody>({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true},
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: Number, required: true },
    gender: { type: String, required: true },
    
}, {timestamps:true});

// user model
export const User = mongoose.model<UserTypeBody>("User", userSchema)