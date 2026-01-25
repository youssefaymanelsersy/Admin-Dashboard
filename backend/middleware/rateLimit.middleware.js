import rateLimit from "express-rate-limit";

// Generic limiter (for APIs)
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.method === "OPTIONS" || req.path === "/health",
});

// Login-specific limiter (stricter)
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skip: (req) => req.method === "OPTIONS",
});
