import express from "express";
import pool from "../../config/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query(
        "SELECT COUNT(*) AS total FROM activity_logs"
    );

    const [logs] = await pool.query(
        `SELECT
        l.id,
        l.action,
        l.entity,
        l.entity_id,
        l.created_at,
        u.email
        FROM activity_logs l
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    res.json({
        page,
        limit,
        total,
        logs,
    });
});

export default router;
