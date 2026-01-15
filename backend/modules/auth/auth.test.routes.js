import express from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.get(
  "/admin-only",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({
      message: "Welcome admin",
      user: req.user,
    });
  }
);

export default router;
