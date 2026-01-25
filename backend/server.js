import "dotenv/config";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import authTestRoutes from "./modules/auth/auth.test.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import logsRoutes from "./modules/logs/logs.routes.js";
import rateLimiter from "express-rate-limit";

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

// health
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
