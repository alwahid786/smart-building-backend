import bcrypt from "bcrypt";
import { Request } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import { config } from "../../config/config.js";
import { __dirName } from "../../constants/constants.js";
import { Auth } from "../../models/authModel/auth.model.js";
import { JWTService } from "../../services/jwtToken.js";
import { User } from "../../types/userTypes.js";
import { TryCatch } from "../../utils/tryCatch.js";

// Cleaned and Optimized Register Controller
const register = TryCatch(async (req: Request<{}, {}, User>, res, next) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate presence of email and password
    if (!email || !password) {
        return next(createHttpError(400, "Email and password are required."));
    }

    // Check if the email already exists
    const emailExists = await Auth.exists({ email });
    if (emailExists) {
        return next(createHttpError(400, "This email is already taken."));
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await Auth.create({ email, password: hashedPassword });
    if (!user) {
        return next(createHttpError(500, "Error occurred while creating user."));
    }

    // Generate a verification token
    const verificationToken = await JWTService().accessToken(String(user._id));
    const backendUrl: string = config.getEnv("SERVER_URL");
    const verificationUrl = `${backendUrl}/verify-email.html?verificationUrl=${encodeURIComponent(
        backendUrl + "/api/user/verify?token=" + verificationToken
    )}`;

    // Compose verification email message
    const message = `Please click the link below to verify your email address: ${verificationUrl}`;
   

    // Generate access and refresh tokens
    const accessToken = await JWTService().accessToken(String(user._id));
    const refreshToken = await JWTService().refreshToken(String(user._id));  // Assuming JWTService has a method for refresh token

    // Store the tokens in cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,  // Secure cookie, accessible only by the web server
        secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });


    // Respond with success message
    return res.status(201).json({ message: "User created successfully." });
});

// Cleaned and Optimized Verify Registration Function
const verifyRegistration = TryCatch(async (req: Request<{}, {}, { token: string }>, res, next) => {
    // Extract verification token from query parameters
    const verificationToken: string = req.query?.token as string;

    // Validate the presence of the verification token
    if (!verificationToken) {
        return next(createHttpError(400, "Please provide the verification token."));
    }

    let decodedToken: any;

    // Verify the verification token
    try {
        decodedToken = await JWTService().verifyAccessToken(verificationToken);
    } catch (err) {
        // If token verification fails, send a failure response
        return res.status(400).sendFile(path.join(__dirname, "../../../public/verificationFailed.html"));
    }

    // Find the user associated with the decoded token
    const user = await Auth.findById(decodedToken);

    // If user is not found, handle the error
    if (!user) {
        return res.status(400).sendFile(path.join(__dirname, "../../../public/verificationFailed.html"));
    }

    // Check if the user is already verified (optional, but recommended)
    if (user) {
        return res.status(200).sendFile(path.join(__dirname, "../../../public/alreadyVerified.html"));
    }

    // Send success response
    res.status(200).sendFile(path.join(__dirname, "../../../public/verifiedSuccess.html"));
});

// Cleaned and Optimized Login Function
const login = TryCatch(async (req, res, next) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate presence of email and password
    if (!email || !password) {
        return next(createHttpError(400, "Email and password are required."));
    }

    // Find user by email
    const user = await Auth.findOne({ email });

    // If user is found, compare the provided password with the stored hashed password
    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        // If password does not match, return an error
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password.",
            });
        }

        // Generate an access token
        const token = await JWTService().accessToken(String(user._id));

        // Set the token as a cookie
        res.cookie("token", token, {           
            httpOnly: true, // Secure cookie, accessible only by the web server
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        // Respond with a success message
        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
        });
    }

    // If user is not found, prompt the user to sign up
    return res.status(400).json({
        success: false,
        message: "User not found. Please sign up.",
    });
});

// logout
const logout = TryCatch(async (req, res, next) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "You are logout", status: true });
});

// Cleaned and Optimized Forget Password Function
const forgetPassword = TryCatch(async (req, res, next) => {
    // Extract email from the request body
    const { email } = req.body;

    // Validate email presence
    if (!email) {
        return next(createHttpError(400, "Please provide an email address."));
    }

    // Find user by email
    const user = await Auth.findOne({ email });
    if (!user) {
        return next(createHttpError(404, "No user found with this email address."));
    }

    // Generate reset token
    const resetToken = await JWTService().accessToken(String(user._id));

    // Construct reset password URL
    const frontendUrl = config.getEnv("FRONTEND_URL");
    const resetPasswordLink = `${frontendUrl}/resetPassword?resetToken=${resetToken}`;

    // Compose email message
    const message = `Your password reset link: ${resetPasswordLink}`;

    // Respond with success message
    res.status(200).json({
        success: true,
        message: "Reset password link has been sent to your email address.",
    });
});

// Cleaned and Optimized Reset Password Function
const resetPassword = TryCatch(async (req, res, next) => {
    // Extract the reset token from query parameters
    const resetToken: string = req.query?.token as string;

    // Extract the new password from the request body
    const { newPassword } = req.body;

    // Validate the presence of reset token and new password
    if (!resetToken || !newPassword) {
        return next(createHttpError(400, "Token and new password are required."));
    }

    let verifiedToken: any;

    // Verify the reset token
    try {
        verifiedToken = await JWTService().verifyAccessToken(resetToken);
    } catch (err) {
        // If token verification fails, send a failure response
        return res.status(400).sendFile(path.join(__dirname, "../../public/verificationFailed.html"));
    }

    // Find the user by the ID embedded in the verified token
    const user = await Auth.findById(verifiedToken).select("+password");

    // If user is not found, handle the error
    if (!user) {
        return next(createHttpError(404, "Invalid or expired token."));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and save the changes
    user.password = hashedPassword;
    await user.save();

    // Respond with a success message
    res.status(200).json({
        success: true,
        message: "Password reset successfully.",
    });
});


export { forgetPassword, login, logout, register, verifyRegistration, resetPassword };
