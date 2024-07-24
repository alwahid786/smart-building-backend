import { createSensor, getAllSensorsData,addFakeSensorData } from "../../controllers/sensors/sensorsController.js";


// create sensor api routes
export const sensorRoutes = (app: any) => {

    // create sensor
    app.post("/api/create/sensors", createSensor);

    // get allsensors data
    app.get("/api/all-sensors-data", getAllSensorsData);

    app.post("/api/add-fake-sensors-data",addFakeSensorData);
}