import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { getAllChats, getAllFriends } from "../controllers/friend.controller";

const router = Router();

router.use(verifyToken);

router.route("/").get(getAllFriends);
router.route("/chats").get(getAllChats);

export default router;
