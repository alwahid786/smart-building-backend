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
      required: true,
      default:[]
    },
    latitude: { type: Number},
    longitude: { type: Number},
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensors" }],
  },
  { timestamps: true }
);

// building model
export const Building = mongoose.model<BuildingSchemaTypes>(
  "Building",
  buildingSchema
);


// longitude and latitude schema
export const LocationSchema = new mongoose.Schema({
  longitude: { type: Number },
  latitude: { type: Number },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building" },
})

// longtudeand latitude model
export const Location = mongoose.model("Location", LocationSchema)