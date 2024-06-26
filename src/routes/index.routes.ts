import { userRoutes } from "./authRoutes/auth.routes.js";
import { userApiRoutes } from "./userRoutes/user.routes.js";

export const allApiRoutes = (app: any) => {
    
    // auth routes
    userRoutes(app);

    // user routes
    userApiRoutes(app);
};
