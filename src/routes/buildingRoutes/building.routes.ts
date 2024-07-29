import {
  addBuilding,
  addBuildingFloor,
  addBuildingLocation,
  deleteBuilding,
  getAllBuildings,
  getBuildingSensors,
  getSingleBuilding,
  updateBuilding,
} from "../../controllers/building/buildingController.js";
import { buildingUpload, fileUpload } from "../../utils/multer.js";

// building api routes
export const buildingRoutes = (app: any) => {
  // add building
  app.post("/api/create/building",fileUpload, addBuilding);

  // add floor
  app.post("/api/create/floor", buildingUpload, addBuildingFloor)

  // get all building profissional  bu
  app.get("/api/all-building",  getAllBuildings);

  // get single building
  app.get("/api/single-building/:id",  getSingleBuilding);

  // update building
  app.put("/api/update-building/:id", fileUpload,  updateBuilding);

  // delete building
  app.delete("/api/delete-building/:id",  deleteBuilding);

  // add building location
  app.put("/api/add-building-location/:id",  addBuildingLocation);

  // getBuildingSensors
  app.get("/building/:id/sensors",  getBuildingSensors);
  
};
