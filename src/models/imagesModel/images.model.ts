import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    // buildingId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Building',
    //   required: true
    // },
    images: {
      type: [String], // Assuming you store URLs as strings
      required: true
    }
  });
export const Image = mongoose.model("Image", imageSchema)