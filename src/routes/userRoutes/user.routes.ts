import {
    forgetPassword,
    login,
    logout,
    register,
    resetPassword,
    verifyRegistration,
} from "../../controllers/user/userController.js";
import { auth } from "../../middlewares/auth.js";

export const userRoutes = (app: any) => {
    // register user
    app.post("/api/user/register", register);

    // login user
    app.post("/api/user/login", login);

    // logout user
    app.get("/api/user/logout", auth, logout);

    // verify registration
    app.get("/api/user/verify", verifyRegistration);

    // forget password
    app.put("/api/user/forget-password", forgetPassword);

    // reset password
    app.post("/api/user/reset-password", resetPassword);
};
