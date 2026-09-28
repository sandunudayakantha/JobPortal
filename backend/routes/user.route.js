import express from "express";
//Google OAuth/OpenID Connect Implementation
import { login, logout, register, updateProfile, googleLogin } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { imageUpload, documentUpload } from "../middlewares/mutler.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Fix for Rate Limiting: authLimiter applied to login and register routes
router.route("/register").post(authLimiter, imageUpload.single('file'), register);
router.route("/login").post(authLimiter, login);
router.route("/logout").get(logout);
//Google OAuth/OpenID Connect Implementation
router.route("/google-login").post(googleLogin);
router.route("/profile/update").post(isAuthenticated, documentUpload.single('file'), updateProfile);

export default router;
