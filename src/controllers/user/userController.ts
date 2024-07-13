import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Auth } from "../../models/authModel/auth.model.js";

// get single user
export const userProfile = TryCatch(async (req, res, next) => {
  const { _id } = req.user;

  const user = await Auth.findById(_id);

  return res.status(200).json(user);
});

// update user profile
export const updateProfile = TryCatch(async (req, res, next) => {
   
    const { id } = req.params;

    const updatedUser = await Auth.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

    if (!updatedUser) {return res.status(404).json({ message: "User not found" })};

    const savedUser = await updatedUser.save();

    if(savedUser) {res.status(200).json({ message: "Profile updated successfully" });}
  });
  