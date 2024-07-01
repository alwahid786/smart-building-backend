import {
  addBuilding,
  deleteBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateBuilding,
} from "../../controllers/building/buildingController.js";
import { auth } from "../../middlewares/auth.js";
import { fileUpload } from "../../utils/multer.js";

// building api routes
export const buildingRoutes = (app: any) => {
  // add building
  app.post("/api/create/building", fileUpload,  addBuilding);

  // get all building
  app.get("/api/all-building",  getAllBuildings);

  // get single building
  app.get("/api/single-building/:id",  getSingleBuilding);

  // update building
  app.put("/api/update-building/:id",  updateBuilding);

  // delete building
  app.delete("/api/delete-building/:id",  deleteBuilding);
  
};
