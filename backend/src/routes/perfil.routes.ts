import express from "express";
import {
  getPerfil,
  updatePerfil,
  getHistorialReservas,
} from "../controllers/perfil.controller";
import { authenticateToken } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(getPerfil));
router.put("/", authenticateToken, asyncHandler(updatePerfil));
router.get("/historial", authenticateToken, asyncHandler(getHistorialReservas));

export default router;
