import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
    createGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    searchGroup,
} from "../controllers/group.controller";

const router = Router();

router.use(verifyToken);

router.route("/search").get(searchGroup);

router.route("/create").post(createGroup);
router.route("/:groupId/join").post(joinGroup);
router.route("/:groupId/leave").post(leaveGroup);
router.route("/:groupId").delete(deleteGroup);

export default router;
