import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";

import express from "express";
import authRoutes from "./modules/auth/auth.routes.js   ";
import authTestRoutes from "./modules/auth/auth.test.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import logsRoutes from "./modules/logs/logs.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://increased-jody-youssef-org-43ede976.koyeb.app"
        ],
        credentials: true,
    })
);


// middleware to parse JSON
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/test", authTestRoutes);
app.use("/users", usersRoutes);
app.use("/stats", statsRoutes);
app.use("/logs", logsRoutes);
app.use(errorHandler);


// health check route
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
