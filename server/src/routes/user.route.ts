import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
    getSession,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller";

const router = Router();

router.route("/session").get(verifyToken, getSession);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);

export default router;
