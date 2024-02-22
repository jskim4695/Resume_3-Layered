import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const usersController = new UsersController();

router.post("/sign-up", usersController.userSignUp);
router.post("/sign-in", usersController.userSignIn);
router.get("/users", authMiddleware, usersController.getUser);

export default router;
