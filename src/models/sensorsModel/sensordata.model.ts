import mongoose from "mongoose";

// sensordata schema
const sensorDataSchema = new mongoose.Schema({}, { strict: false });

export const SensorData = mongoose.model("Sensordata", sensorDataSchema, "sensordatas");
