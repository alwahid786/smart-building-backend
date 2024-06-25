import {
    forgetPassword,
    login,
    logout,
    register,
} from "../../controllers/user/userController.js";
import { auth } from "../../middlewares/auth.js";

export const userRoutes = (app: any) => {
    // register user
    app.post("/api/user/register", register);

    // login user
    app.post("/api/user/login", login);

    // logout user
    app.get("/api/user/logout", auth, logout);

    // forget password
    app.put("/api/user/forget-password", forgetPassword);

};
