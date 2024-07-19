import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { TryCatch } from "../utils/tryCatch.js";
import { JWTService } from "../services/jwtToken.js";
import { Auth } from "../models/authModel/auth.model.js";
import { JwtPayload } from "jsonwebtoken"; // Import JwtPayload type from jsonwebtoken library or your custom type if defined

declare module "express-serve-static-core" {
  interface Request {
    user?: { _id: string; };
  }
}

export const auth = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = req.cookies;

      if (!accessToken || !refreshToken) {
        return next(createHttpError(401, "Please login first"));
      }

      // Verify access token
      let verifyAccessToken: JwtPayload | string; // Type can be JwtPayload or string
      try {
        verifyAccessToken = await JWTService().verifyAccessToken(accessToken);
      } catch (err) {
        console.error("Access Token Error: ", err);
        return next(
          createHttpError(401, "Invalid access token, please login again")
        );
      }

      // Check if verifyAccessToken is a string (error case)
      if (typeof verifyAccessToken === "string") {
        return next(createHttpError(401, "Invalid access token, please login again"));
      }

      // Verify refresh token
      let verifyRefreshToken;
      try {
        verifyRefreshToken = await JWTService().verifyRefreshToken(
          refreshToken
        );
      } catch (err) {
        console.error("Refresh Token Error: ", err);
        return next(
          createHttpError(401, "Invalid refresh token, please login again")
        );
      }

      const { _id } = verifyAccessToken; // Now TypeScript knows verifyAccessToken is JwtPayload

      // Fetch user from database
      const user = await Auth.findById(_id);

      if (!user) {
        return next(createHttpError(404, "User not found")); // Handle case where user is null
      }

      req.user = { _id: user._id.toString() }; // Convert _id to string explicitly

      next();
    } catch (error) {
      return next(error);
    }
  }
);
