import mongoose from "mongoose";

// token schema
const tokenSchema = new mongoose.Schema({

    refreshToken: {type:String, required:true}

},{timestamps: true})


export const Token = mongoose.model("Token", tokenSchema);