import rateLimit from "express-rate-limit";

// Auth Limiter: Protects login, register, etc.
// 20 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication requests. Please try again later."
    }
});

// Contact Limiter: Protects contact form submission
// 5 requests per 30 minutes
export const contactLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many contact requests from this IP. Please try again later."
    }
});

// ATS/AI Limiter: Protects resource-intensive endpoints like resume analysis
// 10 requests per 60 minutes
export const atsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many resume analysis requests. Please try again later."
    }
});
