import { userRoutes } from "./authRoutes/auth.routes.js";
import { buildingRoutes } from "./buildingRoutes/building.routes.js";
import { sensorRoutes } from "./sensors/sensors.routes.js";
import { userApiRoutes } from "./userRoutes/user.routes.js";

export const allApiRoutes = (app: any) => {
    
    // auth routes
    userRoutes(app);

    // user routes
    userApiRoutes(app);

    // building routes
    buildingRoutes(app);

    // sensors routes
    sensorRoutes(app);
};
