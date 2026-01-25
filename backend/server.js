import "dotenv/config";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import authTestRoutes from "./modules/auth/auth.test.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import logsRoutes from "./modules/logs/logs.routes.js";
import { rateLimiter } from "./middleware/rateLimit.middleware.js";
import { pool } from "./config/db.js";


const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS (Express 5 safe)
app.use(
    cors({
        origin: true, // 🔑 allow ALL origins (Choreo-safe)
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.options(/.*/, cors());

// middleware
app.use(express.json());

app.use(rateLimiter);

// routes
app.use("/auth", authRoutes);
app.use("/test", authTestRoutes);
app.use("/users", usersRoutes);
app.use("/stats", statsRoutes);
app.use("/logs", logsRoutes);

// error handler
app.use(errorHandler);

app.get("/health", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT VERSION() AS version, DATABASE() AS db"
        );

        res.json({
            ok: true,
            database: rows[0],
            environment: process.env.NODE_ENV || "development"
        });
    } catch (err) {
        res.status(503).json({ ok: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
