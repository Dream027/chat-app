import { Router } from "express";
import {
    acceptInvitation,
    deleteInvitation,
    getAllFriends,
    getFriendProfile,
    inviteFriend,
    inviteFriendByEmail,
    rejectInvitation,
    searchFriend,
} from "../controllers/friends.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyAccessToken);

router.route("/").get(getAllFriends);

router.route("/search").post(searchFriend);
router.route("/:friendId/invitations").post(acceptInvitation);
router.route("/:friendId/invite").post(inviteFriend);
router.route("/invite").post(inviteFriendByEmail);
router.route("/:friendId/profile").post(getFriendProfile);

router.route("/:friendId/invitations").delete(deleteInvitation);
router.route("/:friendId/invitations/reject").delete(rejectInvitation);

export default router;
