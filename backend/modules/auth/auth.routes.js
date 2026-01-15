import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../config/db.js";
import { loginRateLimiter } from "../../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/login",loginRateLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const err = new Error("Missing credentials");
            err.status = 400;
            throw err;
        }

        const [rows] = await pool.query(
            "SELECT id, password_hash, role, is_active FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];

        if (!user || !user.is_active) {
            await pool.query(
                "INSERT INTO login_logs (user_id, success) VALUES (?, ?)",
                [user?.id ?? null, 0]
            );
            const err = new Error("Invalid credentials");
            err.status = 401;
            throw err;
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            await pool.query(
                "INSERT INTO login_logs (user_id, success) VALUES (?, ?)",
                [user.id, 0]
            );
            const err = new Error("Invalid credentials");
            err.status = 401;
            throw err;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await pool.query(
            "INSERT INTO login_logs (user_id, success) VALUES (?, ?)",
            [user.id, 1]
        );

        res.json({ token });
    } catch (err) {
        next(err);
    }
});

export default router;
