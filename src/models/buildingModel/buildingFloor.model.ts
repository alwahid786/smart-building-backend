import mongoose from "mongoose";

const buildingFloorSchema = new mongoose.Schema({
    floor: { type: Number, required: true },
    rooms: { type: Number, required: true },
    floorImage: { type: String, required: true },
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }],
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
}, { timestamps: true });

export const BuildingFloor = mongoose.model('BuildingFloor', buildingFloorSchema);
