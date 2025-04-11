import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);

export default authRouter;
