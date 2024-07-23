import { createSensor, getAllSensors } from "../../controllers/sensors/sensorsController.js";


// create sensor api routes
export const sensorRoutes = (app: any) => {

    // create sensor
    app.post("/api/create/sensors", createSensor);

    // get all sensors
    app.get("/api/all-sensors", getAllSensors);
}