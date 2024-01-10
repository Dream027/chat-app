import { Router } from "express";
import { getAllFriends } from "../controllers/friends.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(verifyAccessToken, getAllFriends);

export default router;
