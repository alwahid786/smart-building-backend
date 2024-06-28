import {
  addBuilding,
  deleteBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateBuilding,
} from "../../controllers/building/buildingController.js";
import { auth } from "../../middlewares/auth.js";

// building api routes
export const buildingRoutes = (app: any) => {
  // add building
  app.post("/api/create/building",  addBuilding);

  // get all building
  app.get("/api/all-building", auth, getAllBuildings);

  // get single building
  app.get("/api/single-building/:id", auth, getSingleBuilding);

  // update building
  app.put("/api/update-building/:id", auth, updateBuilding);

  // delete building
  app.delete("/api/delete-building/:id", auth, deleteBuilding);
};
