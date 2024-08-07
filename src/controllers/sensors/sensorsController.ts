import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Sensors } from "../../models/sensorsModel/sensors.model.js";
import { SensorData } from "../../models/sensorsModel/sensordata.model.js";
import { BuildingFloor } from "../../models/buildingModel/buildingFloor.model.js";
import NodeCache from "node-cache";

// Initialize cache
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL (time-to-live) in seconds

// Define a TypeScript interface for the sensor data
interface Sensor extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    payload: string;
}

// Create sensor
export const createSensor = TryCatch(async (req, res, next) => {
    const { sensorName, sensorType, ip, port, uniqueId } = req.body;

    if (!sensorName || !sensorType || !ip || !port || !uniqueId) {
        return next(createHttpError(400, "All fields are required!"));
    }

    // Check if sensor already exists with the same uniqueId
    const sensorExists = await Sensors.exists({ uniqueId });
    if (sensorExists) {
        return next(createHttpError(400, "Sensor already exists"));
    }

    // const sensorsMqttData = await SensorData.findOne({ 'payload.uniqueId': uniqueId });
    const sensorsMqttData = await SensorData.findOne({sensor_id : uniqueId });
    if (!sensorsMqttData) {
        return next(createHttpError(400, "Unique ID not found in sensor data!"));
    }

    // Create sensor
    await Sensors.create({ sensorName, sensorType, ip, port, uniqueId, sensorId: sensorsMqttData._id });

    // Invalidate cache for getAllSensors
    cache.del("getAllSensors");

    return res.status(200).json({ message: "Sensor connected successfully" });
});

// Get all sensors data
export const getAllSensors = TryCatch(async (req, res, next) => {
    // Check cache first
    const cachedSensors = cache.get("getAllSensors");
    if (cachedSensors) {
        return res.status(200).json(cachedSensors);
    }

    const sensors = await Sensors.find();

    // Store in cache
    cache.set("getAllSensors", sensors);

    return res.status(200).json(sensors);
});

// get single sensor details
export const getSingleSensor = TryCatch(async (req, res, next) => {

    const { id } = req.params;

    const sensor = await Sensors.findOne({sensorId:id}).populate("sensorId");

    console.log(sensor)

    return res.status(200).json(sensor);
    
});

// Get all sensors data
export const getAllSensorsData = TryCatch(async (req, res, next) => {
    const sensors = await SensorData.find().limit(10).sort({ createdAt: -1 }).limit(5);

    // Parse the payload field for each sensor
    const parsedSensors = sensors.map(sensor => {
        const sensorObj = sensor.toObject() as Sensor;
        try {
            sensorObj.payload = JSON.parse(sensorObj.payload);
        } catch (error) {
            console.error("Error parsing sensor payload: ", error);
        }
        return sensorObj;
    });

    return res.status(200).json(parsedSensors);
});

// Add fake sensor data
export const addFakeSensorData = TryCatch(async (req, res, next) => {
    const { topic, payload } = req.body;

    const sensor = await SensorData.create({ topic, payload });

    return res.status(201).json({ success: true, message: "Sensor created successfully" });
});

// Get single building sensors
export const getBuildingSensors = TryCatch(async (req, res, next) => {
    const { buildingId } = req.params;

    // Check cache first
    const cachedBuildingSensors = cache.get(`getBuildingSensors_${buildingId}`);
    if (cachedBuildingSensors) {
        return res.status(200).json(cachedBuildingSensors);
    }

    // Find all BuildingFloors for the given buildingId and populate sensors
    const buildingFloors = await BuildingFloor.find({ buildingId }).populate('sensors');

    // Store in cache
    cache.set(`getBuildingSensors_${buildingId}`, buildingFloors);

    return res.status(200).json(buildingFloors);
});
