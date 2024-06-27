import mongoose from "mongoose";
import { BuildingSchemaTypes } from "../../types/buildingTypes.js";

// building schema
const buildingSchema = new mongoose.Schema<BuildingSchemaTypes>({

    name: { type: String, required: true },
    address: { type: String, required: true },
    owner: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    totalArea: { type: Number, required: true },
    description: { type: String, required: true },
    numberOfFloors: { type: Number, required: true },
    constructionYear: { type: Number, required: true },
    totalFloors: { type: Number, required: true }

}, {timestamps:true});

// building model
export const Building = mongoose.model<BuildingSchemaTypes>("Building", buildingSchema)