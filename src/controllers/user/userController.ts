import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { User } from "../../models/userModel/user.model.js";

// create user
export const createUser = TryCatch(async(req, res, next)=>{

    // get all user data from body
    const {name, email, mobile, address, city, state, country, pincode, gender} = req.body;

    // validate all fields
    if(!name || !email || !mobile || !address|| !city || !state || !country || !pincode || !gender){

        return next(createHttpError(400, "All fields are required"));
    }

    // create user
    const user = await User.create({name, email, mobile, address, city, state, country, pincode, gender});

    // success response
    if(user){return res.status(201).json({ success:true, message: "User created successfully"})}
})


// get all user
export const getAllUser = TryCatch(async(req, res, next)=>{
    

    // get all user from db
    const user = await User.find({});

    if(user.length < 1){

        return res.status(400).json({message: "Opps empty user"})
    }

    return res.status(200).json(user);
})


// get single user
export const getSingleUser = TryCatch(async(req, res, next)=>{

    // get user id from params
    const {id} = req.params;

    const user = await User.findById(id)

    if(!user){

        return res.status(400).json({message: "User not found"})
    }

    return res.status(200).json(user);

})


// update user
export const updateUser = TryCatch(async(req, res, next)=>{

    // get user id from params
    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id, req.body)

    if(!user){

        return res.status(400).json({message: "User not found"})
    }

    await user.save();

    return res.status(200).json({message: "User update successfully"});

})


// delete user
export const deleteUser = TryCatch(async(req, res, next)=>{

    // get user id from params
    const {id} = req.params;

    const user = await User.findById(id)

    if(!user){

        return res.status(400).json({message: "User not found"})
    }

    // delete single user
    await user.deleteOne();

    return res.status(200).json({message: "User delete successfully"});

})