import { Router } from "express";
import {
    getAllFriends,
    getFriendProfile,
    inviteFriend,
} from "../controllers/friends.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyAccessToken);

router.route("/").get(getAllFriends);
router.route("/:friendId/invite").post(inviteFriend);
router.route("/:friendId/profile").post(getFriendProfile);

export default router;
