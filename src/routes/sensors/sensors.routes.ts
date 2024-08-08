import { createSensor, getAllSensorsData,addFakeSensorData, getAllSensors, getSingleSensor, updateSensor, deleteSensor } from "../../controllers/sensors/sensorsController.js";
import multer from "multer";

const upload = multer();

// Middleware to parse form data
const parseFormData = upload.none();

// create sensor api routes
export const sensorRoutes = (app: any) => {

    // create sensor
    app.post("/api/create/sensors", createSensor);

    // get allsensors data
    app.get("/api/all-sensors-data", getAllSensorsData);

    app.get("/api/all-sensors", getAllSensors);

    app.post("/api/add-fake-sensors-data",addFakeSensorData);

    // update sensor
    app.put("/api/update-sensor/:id", parseFormData, updateSensor);

    // delete sensor
    app.delete("/api/delete-sensor/:id", parseFormData, deleteSensor);

    // get single sensor data
    app.get("/api/single/sensor/:id", getSingleSensor);
}