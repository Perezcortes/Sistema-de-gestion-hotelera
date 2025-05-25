import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/profile", authenticateToken, asyncHandler(getUserProfile));

export default router;
