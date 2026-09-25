import express from "express";
//Google OAuth/OpenID Connect Implementation
import { login, logout, register, updateProfile, googleLogin } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
//Google OAuth/OpenID Connect Implementation
router.route("/google-login").post(googleLogin);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;

