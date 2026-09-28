import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

// Protected route to prevent anonymous API quota exhaustion
router.route("/chat").post(isAuthenticated, chatWithAI);

export default router;
