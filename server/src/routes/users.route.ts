import { Router } from "express";
import {
    getInvitations,
    getSession,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    removeFriend,
    updateUser,
} from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();

router.route("/profile").get(verifyAccessToken, getSession);
router.route("/invitations").get(verifyAccessToken, getInvitations);
router.route("/:userId/profile").get(verifyAccessToken, getUserProfile);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAccessToken, logoutUser);

router.route("/update").put(verifyAccessToken, updateUser);

router.route("/:friendId/remove").delete(verifyAccessToken, removeFriend);

export default router;
