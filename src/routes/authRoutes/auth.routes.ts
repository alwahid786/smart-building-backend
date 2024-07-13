import {
    forgetPassword,
    login,
    logout,
    register,
    resetPassword,
    verifyRegistration,
} from "../../controllers/auth/authController.js";
import { auth } from "../../middlewares/auth.js";
import handleValidatorError from "../../middlewares/validationHandler.js";
import { profileImage } from "../../utils/multer.js";
import { forgetPasswordSanitizer } from "../../validation/user.validation.js";

export const userRoutes = (app: any) => {
    // register user  only admin can alow
    app.post("/api/user/register", profileImage, register);

    // login user
    app.post("/api/user/login", login);

    // logout user
    app.post("/api/user/logout", auth, logout);

    // forget password
    app.put("/api/user/forget-password", forgetPassword);

    // verify registration
    app.get("/api/user/verify", verifyRegistration);

    // reset password
    app.post("/api/user/reset-password", resetPassword);

     // forget password
     app.put("/api/user/forget-password", forgetPasswordSanitizer, handleValidatorError, forgetPassword);

};
