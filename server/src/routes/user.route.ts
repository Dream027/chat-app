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
    searchFriendById,
    searchFriends,
    updatePassword,
    updateProfile,
    updateProfilePicture,
} from "../controllers/user.controller";
import { upload } from "../multer.config";

const router = Router();

router.route("/session").get(verifyToken, getSession);
router.route("/friends/search").get(verifyToken, searchFriends);
router.route("/friends").get(verifyToken, searchFriendById);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);

router.route("/invitations").get(verifyToken, getAllInvitations);

router.route("/:friendId/invite").post(verifyToken, inviteUser);
router.route("/:friendId/invitations").delete(verifyToken, deleteInvitation);
router
    .route("/:friendId/invitations/accept")
    .post(verifyToken, acceptInvitation);
router
    .route("/:friendId/invitations/reject")
    .delete(verifyToken, rejectInvitation);

router.route("/profile").put(verifyToken, updateProfile);
router.route("/profile/password").put(verifyToken, updatePassword);
router
    .route("/profile/image")
    .put(verifyToken, upload.single("profilePicture"), updateProfilePicture);

export default router;
