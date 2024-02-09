import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
    acceptInvitation,
    deleteInvitation,
    getAllInvitations,
    getSession,
    inviteUser,
    loginUser,
    logoutUser,
    registerUser,
    rejectInvitation,
} from "../controllers/user.controller";

const router = Router();

router.route("/session").get(verifyToken, getSession);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);

router.route("/invitations").get(verifyToken, getAllInvitations);

router.route("/:friendId/invite").post(verifyToken, inviteUser);
router.route("/:friendId/users/delete").delete(verifyToken, deleteInvitation);
router.route("/:friendId/users/accept").post(verifyToken, acceptInvitation);
router.route("/:friendId/users/reject").delete(verifyToken, rejectInvitation);

export default router;
