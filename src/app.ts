import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { __dirName } from "./constants/costants.js";
import { Errorhandler } from "./middlewares/errorHandler.js";
import { allApiRoutes } from "./routes/index.routes.js";

export const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        // origin: ["http://localhost:5173","https://smart-building-frontend-xp24gu3vc-wahid-ahmads-projects.vercel.app"],
        origin: ["http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Smart Building Backend Dilawar",
    });
});

app.use(express.static(path.join(__dirName, "../../../public")));
// all api routes
allApiRoutes(app);

// global error handler middleware
app.use(Errorhandler);
