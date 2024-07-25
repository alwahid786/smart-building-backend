import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Sensors } from "../../models/sensorsModel/sensors.model.js";
import { SensorData } from "../../models/sensorsModel/sensordata.model.js";


// Define a TypeScript interface for the sensor data
interface Sensor extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    payload: string;
}

// create sensor
export const createSensor = TryCatch(async (req, res, next) => {

    // get all body data
    const { sensorName, sensorType, ip, port, uniqueId } = req.body;

    if (!sensorName || !sensorType || !ip || !port || !uniqueId) {
        return next(createHttpError(400, "All fields are required!"));
    }

    // check if sensor already exists with the same ip and port
    const sensorExists = await Sensors.exists({uniqueId });
    if (sensorExists) {
        return next(createHttpError(400, "Sensor already exists"));
    }

    // check if uniqueId exists in the payload of data sent from MQTT
    const sensorsMqttData = await SensorData.findOne({ 'payload.uniqueId': uniqueId });
    if (!sensorsMqttData) {
        return next(createHttpError(400, "Unique ID not found in sensor data!"));
    }

    // create sensor
    await Sensors.create({ sensorName, sensorType, ip, port, uniqueId });
    return res.status(200).json({ message: "Sensor connected  successfully" });
});


// get all sensors data
export const getAllSensors = TryCatch(async (req, res, next) => {
    const sensors = await Sensors.find();
    return res.status(200).json(sensors);
});


// get all sensors data
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

// get all sensors data
export const addFakeSensorData = TryCatch(async (req, res, next) => {

  const {topic,payload}=req.body

  const sensor = await SensorData.create({topic,payload});
 

  return res.status(201).json({ success: true, message: "Sensor created successfully"});
});