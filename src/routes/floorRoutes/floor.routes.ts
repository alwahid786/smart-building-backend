import { getAllBuildingFloors } from "../../controllers/building/buildingController.js";


// floor api routes
export const floorApiRoutes = (app: any) => {

    app.get("/api/buldingFloor/:id", getAllBuildingFloors);
}