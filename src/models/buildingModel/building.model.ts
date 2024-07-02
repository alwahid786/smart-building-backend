import mongoose from "mongoose";
import { BuildingSchemaTypes } from "../../types/buildingTypes.js";

// building schema
const buildingSchema = new mongoose.Schema<BuildingSchemaTypes>({

    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buildingName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    totalArea: { type: Number, required: true },
    numberOfFloors: { type: Number, required: true },
    description: { type: String, required: true },
    writtenAddress: { type: String, required: true },
    buildingImages: {
        type: [String], // Assuming you store URLs as strings
        required: true
      }

}, {timestamps:true});

// building model
export const Building = mongoose.model<BuildingSchemaTypes>("Building", buildingSchema)