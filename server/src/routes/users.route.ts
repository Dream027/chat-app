import { Router } from "express";
import {
    getSession,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();

router.route("/profile").get(verifyAccessToken, getSession);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAccessToken, logoutUser);

export default router;
