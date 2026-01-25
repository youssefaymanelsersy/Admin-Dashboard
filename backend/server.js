import "dotenv/config";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import authTestRoutes from "./modules/auth/auth.test.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import logsRoutes from "./modules/logs/logs.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configure CORS middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            // add prod frontend later if needed
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Handle preflight explicitly
app.options("*", cors());

// middleware to parse JSON
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/test", authTestRoutes);
app.use("/users", usersRoutes);
app.use("/stats", statsRoutes);
app.use("/logs", logsRoutes);

// error handler (must be last)
app.use(errorHandler);

// health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
