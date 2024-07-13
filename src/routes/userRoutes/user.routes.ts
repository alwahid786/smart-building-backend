import {updateProfile, userProfile,  } from "../../controllers/user/userController.js"
import { auth} from "../../middlewares/auth.js";
import { profileImage } from "../../utils/multer.js";

// user api endpoints
export const userApiRoutes= (app:any)=>{

    // get single user
    app.get("/api/user/userProfile", auth, userProfile);

    // update single user
    app.put("/api/user/update-user/:id", profileImage, auth,  updateProfile);

}