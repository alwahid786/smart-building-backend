import mongoose from "mongoose";

const buildingFloorSchema = new mongoose.Schema({
    floor: { type: String, required: true },
    rooms: { type: Number, required: true },
    floorImage: { type: String, required: true },
    area: { type: Number, required: true },
    floorType: { type: String, required: true },
    unitOfArea: { type: String, required: true },
    sensors: [],
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
}, { timestamps: true });

export const BuildingFloor = mongoose.model('BuildingFloor', buildingFloorSchema);
