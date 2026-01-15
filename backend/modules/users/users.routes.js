import express from "express";
import pool from "../../config/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM users");

        const [users] = await pool.query(
            `SELECT id, email, role, is_active, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        res.json({
            page,
            limit,
            total,
            users,
        });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {

    // Prevent admin from modifying themselves dangerously
    if (id === req.user.userId) {
        if (is_active === 0) {
            const err = new Error("You cannot deactivate your own account");
            err.status = 400;
            throw err;
        }

        if (role && role !== "admin") {
            const err = new Error("You cannot change your own role");
            err.status = 400;
            throw err;
        }
    }

    if (role && role !== "admin") {
        const [[{ adminCount }]] = await pool.query(
            "SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin' AND is_active = 1"
        );

        if (adminCount <= 1) {
            const err = new Error("System must have at least one active admin");
            err.status = 400;
            throw err;
        }
    }


    try {
        const { id } = req.params;
        const { role, is_active } = req.body;

        if (role === undefined && is_active === undefined) {
            const err = new Error("No fields to update");
            err.status = 400;
            throw err;
        }

        const fields = [];
        const values = [];

        if (role !== undefined) {
            fields.push("role = ?");
            values.push(role);
        }

        if (is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(is_active);
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }

        // audit log
        await pool.query(
            `INSERT INTO activity_logs (user_id, action, entity, entity_id)
            VALUES (?, ?, ?, ?)`,
            [req.user.userId, "UPDATE_USER", "users", id]
        );

        res.json({ message: "User updated" });
    } catch (err) {
        next(err);
    }
});


export default router;
