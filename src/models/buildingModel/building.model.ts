import mongoose from "mongoose";
import { BuildingSchemaTypes } from "../../types/buildingTypes.js";

// building schema
const buildingSchema = new mongoose.Schema<BuildingSchemaTypes>(
  {
    buildingName: { type: String},
    ownerName: { type: String},
    phoneNumber: { type: Number},
    email: { type: String},
    totalArea: { type: Number},
    numberOfFloors: { type: Number},
    constructionYear: { type: Date},
    description: { type: String},
    writtenAddress: { type: String},
    images: {
      type: [String], // Assuming you store URLs as strings
      required: true
    }
  },
  { timestamps: true }
);

// building model
export const Building = mongoose.model<BuildingSchemaTypes>(
  "Building",
  buildingSchema
);
