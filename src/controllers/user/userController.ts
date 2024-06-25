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
import { User } from "../../models/userModel/user.model.js";
import { sendMail } from "../../services/sendMail.js";


// register controller
const register = TryCatch(
  async (req: Request<{}, {}, UserTypes>, res, next) => {
    // get all body data and validate
    const { email, password } = req.body;

    if (!email || !password)
      return next(createHttpError(400, "Please Enter All Required Fields"));
    // check user email is already exists
    const emailExists = await User.exists({ email });
    if (emailExists) return next(createHttpError(400, "Email Already Exists"));

    // create user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashPassword,
    });

    if (!user)
      return next(createHttpError(400, "Some Error While Creating User"));

    // make and store access and refresh token in cookies
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
  const user = await User.findOne({ email });

  if (user) {
    // compare password
    const matchPwd = await bcrypt.compare(password, user.password);

    if (matchPwd) {
      // create access and refresh token
      const accessToken = await JWTService().accessToken(String(user._id));
      const refreshToken = await JWTService().refreshToken(String(user._id));
      await JWTService().storeRefreshToken(String(refreshToken));
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);

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
  await JWTService().removeRefreshToken(String(req?.cookies?.refreshToken));
  res.cookie("accessToken", null, { ...accessTokenOptions, maxAge: 0 });
  res.cookie("refreshToken", null, { ...refreshTokenOptions, maxAge: 0 });
  res.status(200).json({ success: true, message: "Logout Successfully" });
});

const forgetPassword = TryCatch(async (req, res, next) => {
    
    const { email } = req.body;
    if (!email) return next(createHttpError(400, "Please Provide Email"));
    try {
        // find user
        const user = await User.findOne({ email });
        if (!user) return next(createHttpError(404, "User not found"));

        // send mail
        const resetPasswordUrl = "http://localhost:5173/reset-password";
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
        console.error("Error in forgetPassword:", err);
        next(createHttpError(500, "Internal Server Error"));
    }
});


export { forgetPassword, login, logout, register };
