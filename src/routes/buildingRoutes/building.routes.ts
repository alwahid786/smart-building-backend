import {
  addBuilding,
  addBuildingFloor,
  addBuildingLocation,
  deleteBuilding,
  getAllBuildings,
  getAllBuildingsByUser,
  getBuildingSensors,
  getSingleBuilding,
  updateBuilding,
  searchBuildings, // Import the search function
} from "../../controllers/building/buildingController.js";
import { buildingUpload, fileUpload } from "../../utils/multer.js";

// building api routes
export const buildingRoutes = (app: any) => {
  // add building
  app.post("/api/create/building", fileUpload, addBuilding);

  // add floor
  app.post("/api/create/floor", buildingUpload, addBuildingFloor);

  // get all buildings
  app.get("/api/all-building", getAllBuildings);

  // get all buildings by user
  app.get("/api/user-building", getAllBuildingsByUser);

  // get single building
  app.get("/api/single-building/:id", getSingleBuilding);

  // update building
  app.put("/api/update-building/:id", fileUpload, updateBuilding);

  // delete building
  app.delete("/api/delete-building/:id", deleteBuilding);

  // add building location
  app.put("/api/add-building-location/:id", addBuildingLocation);

  // get building sensors
  app.get("/building/:id/sensors", getBuildingSensors);

  // search buildings by name
  app.get("/api/search-buildings", searchBuildings); // Add this route

  // add building floor
  app.post("/api/create/floor", buildingUpload, addBuildingFloor);
};
