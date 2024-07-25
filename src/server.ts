import { app } from "./app.js";
import { config } from "./config/config.js";
import { connectDB } from "./database/connection.js";
import { configureCloudinary } from "./utils/cloudinary.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Create HTTP server
const server = createServer(app);

// Create Socket.io instance and attach it to the server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Adjust if necessary
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Handle Socket.io connections
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("welcome", { message: "Welcome to the Socket.io Dilawar khan" });

    socket.on("clientMessage", (data) => {
        console.log("Message from client:", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server and database connection
(async () => {
    const PORT = config.getEnv("PORT") || 8090;
    await configureCloudinary();
    await connectDB(config.getEnv("DATABASE_URL"), io); // Pass io to connectDB

    server.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
        console.log(`Error: ${err}`);
        console.log("Shutting down the server...");
        server.close(() => process.exit(1));
    });
})();
