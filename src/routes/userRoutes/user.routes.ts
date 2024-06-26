import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from "../../controllers/user/userController.js"

// user api endpoints
export const userApiRoutes= (app:any)=>{

    // create user 
    app.post("/api/user/create", createUser)

    // get all users
    app.get("/api/user/all-users", getAllUser)

    // get single user
    app.get("/api/user/single-user/:id", getSingleUser);

    // update single user
    app.put("/api/user/update-user/:id", updateUser);

    // delete single user
    app.delete("/api/user/delete-user/:id", deleteUser);
}