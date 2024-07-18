import bcrypt from "bcrypt";
import { Request } from "express";
import createHttpError from "http-errors";
import {
  __dirName,
  accessTokenOptions,
  refreshTokenOptions,
} from "../../constants/costants.js";
import { JWTService } from "../../services/jwtToken.js";
import { UserTypes } from "../../types/userTypes.js";
import { TryCatch } from "../../utils/tryCatch.js";
import { Auth } from "../../models/authModel/auth.model.js";
import { sendMail } from "../../services/sendMail.js";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// register controller
const register = TryCatch(
  async (req: Request<{}, {}, UserTypes>, res, next) => {
    // Destructure request body
    const { firstName, lastName,email, address, phoneNumber, city, country, state, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !address || !phoneNumber || !email || !city || !country || !state || !password) {
      return next(createHttpError(400, "All fields are required!"));
    }

    // Check if email already exists
    const emailExists = await Auth.exists({ email });
    if (emailExists) {
      return next(createHttpError(400, "Email Already Exists"));
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary if available
    let profilePicUrl;
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePicUrl = result.secure_url; // Assuming 'secure_url' gives the HTTPS URL of the uploaded image
    }

    // Create user with profile picture URL
    const user = await Auth.create({
      firstName,
      lastName,
      profilePic: profilePicUrl,
      address,
      phoneNumber,
      email,
      city,
      country,
      state,
      password: hashPassword
    });

    if (!user) {
      return next(createHttpError(400, "Some Error While Creating User"));
    }

    // Generate and store access and refresh tokens in cookies
    const accessToken = await JWTService().accessToken(String(user._id));
    const refreshToken = await JWTService().refreshToken(String(user._id));
    await JWTService().storeRefreshToken(String(refreshToken));
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    
    return res.status(201).json({ message: "User created successfully" });
  }
);

// login
const login = TryCatch(async (req, res, next) => {
  // get all body data
  const { email, password } = req.body;
  if (!email || !password)
    return next(createHttpError(400, "All fields are required!"));
  // match user
  const user = await Auth.findOne({ email });

  if (user) {
    // compare password
    const matchPwd = await bcrypt.compare(password, user.password);

    if (matchPwd) {
      // create access and refresh token
      const accessToken = await JWTService().accessToken(String(user._id));
      const refreshToken = await JWTService().refreshToken(String(user._id));
      await JWTService().storeRefreshToken(String(refreshToken));

      // set cookies
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true});

      return res.status(200).json({
        success: true,
        message: "You are logged in successfully",
        data: user,
      });
    } else {
      return next(createHttpError(400, "Wrong username or password"));
    }
  }

  return res
    .status(400)
    .json({ success: false, message: "No user exists with this email" });
});

// logout
const logout = TryCatch(async (req, res, next) => {
  
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ success: true, message: "Logout Successfully" });
});

const forgetPassword = TryCatch(async (req, res, next) => {

    const { email } = req.body;
    if (!email) return next(createHttpError(400, "Please Provide Email"));
    try {
        // find user
        const user = await Auth.findOne({ email });
        if (!user) return next(createHttpError(404, "User not found"));

        // send mail
        const resetPasswordUrl = "http://localhost:5173/resetpassword";
        const resetToken = await JWTService().accessToken(String(user._id));
        const message = `Your Reset Password Link: ${resetPasswordUrl}/${resetToken}`;

        const isMailSent = await sendMail(email, "Reset Password", message);
        if (!isMailSent) {
            return next(createHttpError(500, "Failed to send reset email"));
        }

        res.status(200).json({
            success: true,
            message: "Reset Password Token sent to your email",
        });
    } catch (err) {
        
       return next(createHttpError(500, "Internal Server Error"));
    }
});

const verifyRegistration = TryCatch(async (req: Request<{}, {}, { token: string }>, res, next) => {
    const verificationToken: string = req.query?.token as string;
    if (!verificationToken) return next(createHttpError(400, "Please Provide Verification Token"));
    let decodedToken: any;
    try {
        decodedToken = await JWTService().verifyAccessToken(verificationToken);
    } catch (err) {
        return res.status(400).sendFile(path.join(__dirName, "../../../public/verificationFailed.html"));
    }
    // find user and verify token
    const user = await Auth.findById(decodedToken);
    if (!user)
        return res.status(400).sendFile(path.join(__dirName, "../../../public/verificationFailed.html"));
    // update user
    await user.save();
    res.status(200).sendFile(path.join(__dirName, "../../../public/verifiedSuccess.html"));
});

const resetPassword = TryCatch(async (req,res, next) => {
    const resetToken: string = req.body?.token as string;
    console.log(resetToken)
    const { newpassword } = req.body;

    console.log(newpassword)

    if (!resetToken || !newpassword) {
        return next(createHttpError(400, "Token and New Password are required"));
    }

   const isVerified = await JWTService().verifyAccessToken(resetToken);

   console.log(isVerified)

    const user = await Auth.findById(isVerified).select("+password");
    if (!user) {
        return next(createHttpError(404, "Invalid or Expired Token"));
    }

    const hashPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Password Reset Successfully" });
});
const getNewAccessToken = TryCatch(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return next(createHttpError(401, "Please Login Again"));
    let verifyToken: any;
    try {
        verifyToken = await JWTService().verifyRefreshToken(refreshToken);
    } catch (err) {
        return next(createHttpError(401, "Please Login Again"));
    }
    if (verifyToken) {
        const user = await Auth.findById(verifyToken._id);
        if (!user) return next(createHttpError(401, "Please Login Again"));
        const newAccessToken = await JWTService().accessToken(String(user._id));
        const newRefreshToken = await JWTService().refreshToken(String(user._id));
        // remove old Refresh Token and save new refresh token
        await Promise.all([
            JWTService().removeRefreshToken(String(refreshToken)),
            JWTService().storeRefreshToken(String(newRefreshToken)),
        ]);
        res.cookie("accessToken", newAccessToken, accessTokenOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);
        res.status(200).json({ success: true, message: "New Authentication Created SuccessFully" });
    }
});

export { forgetPassword, login, logout, register, verifyRegistration, resetPassword, getNewAccessToken };
