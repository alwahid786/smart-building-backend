import { userRoutes } from "./userRoutes/user.routes.js";

export const allApiRoutes = (app: any) => {
    
    // user routes
    userRoutes(app);
};
