import { createSensor, getAllSensorsData,addFakeSensorData, getAllSensors, getSingleSensor } from "../../controllers/sensors/sensorsController.js";


// create sensor api routes
export const sensorRoutes = (app: any) => {

    // create sensor
    app.post("/api/create/sensors", createSensor);

    // get allsensors data
    app.get("/api/all-sensors-data", getAllSensorsData);

    app.get("/api/all-sensors", getAllSensors);

    app.post("/api/add-fake-sensors-data",addFakeSensorData);

    // get single sensor data
    app.get("/api/single/sensor/:id", getSingleSensor);
}