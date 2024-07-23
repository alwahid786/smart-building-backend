// sensors.model.js
import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({

    sensorName: {type: String, required: true},
    sensorType: { type: String, required: true},
    uniqueId: {type: String,requird: true},
    ip: {type: String},
    port: {type: String},
    location: {type: String, required: true},

}, { timestamps: true });

export const Sensors = mongoose.model('Sensors', sensorSchema);
