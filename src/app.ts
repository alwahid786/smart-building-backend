import express from "express";
import { Errorhandler } from "./middlewares/errorHandler.js";
import { allApiRoutes } from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { __dirName } from "./constants/constants.js";
import path from "node:path";
export const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirName, "../../../public")));
// all api routes
allApiRoutes(app);

// global error handler middleware
app.use(Errorhandler);