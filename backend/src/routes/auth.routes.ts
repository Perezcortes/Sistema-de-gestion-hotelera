import express from "express";
import { registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", (req, res, next) => {
  registerUser(req, res).catch(next);
});

export default router;
