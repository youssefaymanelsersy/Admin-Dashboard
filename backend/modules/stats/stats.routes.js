import express from "express";
import pool from "../../config/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/overview", requireAuth, requireRole("admin"), async (req, res) => {
    const [[{ totalUsers }]] = await pool.query(
        "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[{ activeUsers }]] = await pool.query(
        "SELECT COUNT(*) AS activeUsers FROM users WHERE is_active = 1"
    );

    const inactiveUsers = totalUsers - activeUsers;

    const [recentActivity] = await pool.query(
        `SELECT action, entity, created_at
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 5`
    );

    res.json({
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentActivity,
    });
});

export default router;
