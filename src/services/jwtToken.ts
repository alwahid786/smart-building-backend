import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const JWTService = () => {
    return {
        // create access token
        async accessToken(payload: string) {
            return jwt.sign(payload, config.getEnv("SIGN_ACCESS_TOKEN"));
        },

        // create refresh token
        async refreshToken(payload: string) {
            return jwt.sign(payload, config.getEnv("SIGN_REFRESH_TOKEN"));
        },

        // verify access token
        async verifyAccessToken(token: string) {
            return jwt.verify(token, config.getEnv("SIGN_ACCESS_TOKEN"));
        },

        // verify refresh token
        async verifyRefreshToken(token: string) {
            return jwt.verify(token, config.getEnv("SIGN_REFRESH_TOKEN"));
        },
    };
};
