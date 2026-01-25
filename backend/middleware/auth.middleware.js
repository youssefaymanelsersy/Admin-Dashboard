import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    // ✅ ALLOW CORS PREFLIGHT
    if (req.method === "OPTIONS") {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const err = new Error("Missing or invalid token");
        err.status = 401;
        return next(err);
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        const error = new Error("Invalid or expired token");
        error.status = 401;
        return next(error);
    }
}

export function requireRole(role) {
    return (req, res, next) => {
        // OPTIONS never has user
        if (req.method === "OPTIONS") {
            return next();
        }

        if (req.user.role !== role) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        next();
    };
}
