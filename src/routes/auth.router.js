import express from "express";
import { generateNewAccessTokenByFreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/token", generateNewAccessTokenByFreshToken);

export default router;
