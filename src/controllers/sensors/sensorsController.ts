import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Sensors } from "../../models/sensorsModel/sensors.model.js";

// create sensor
export const createSensor = TryCatch(async (req, res, next) => {

    // get all body data
    const {sensorName, sensorType, ip, port, location, uniqueId} = req.body;
    
    if (!sensorName || !sensorType || !ip || !port || !location || !uniqueId) {
        return next(createHttpError(400, "All fields are required!"));
    }

    // check if sensor already exists
    const sensorExists = await Sensors.exists({ ip, port });
    if (sensorExists) {
        return next(createHttpError(400, "Sensor Already Exists"));
    }

    // TODO check if sensors  unique id exists in the payload of data wich is sended from mqtt then add sensor esle send err to user 
    

    // create sensor
    const sensor = await Sensors.create({ sensorName, sensorType, ip, port, location, uniqueId});

    return res.status(200).json({ success: true, message: "Sensor created successfully", data: sensor });

});

// get all sensors
export const getAllSensors = TryCatch(async (req, res, next) => {

    const sensors = await Sensors.find();
    return res.status(200).json(sensors);
})