import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => {
        return req.method === "OPTIONS" || req.path === "/health";
    },
});

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skip: (req) => req.method === "OPTIONS",
});
