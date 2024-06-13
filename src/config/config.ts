import { config as dotEnvConfig } from "dotenv";
import { Config } from "../types/globalTypes.js";
dotEnvConfig();

const _config: Config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    env: process.env.NODE_ENV,
    SIGN_ACCESS_TOKEN: process.env.SIGN_ACCESS_TOKEN,
    SIGN_REFRESH_TOKEN: process.env.SIGN_REFRESH_TOKEN,
    SERVER_URL: process.env.SERVER_URL,
  
};

export const config = {
  getEnv: (key: string): string => {
    const value: string | undefined = _config[key];
    if (!value) throw new Error(`Missing environment variable ${key}`);
    return value;
  },
};
