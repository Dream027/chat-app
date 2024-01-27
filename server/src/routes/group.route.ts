import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import {
    createGroup,
    deleteGroup,
    joinGroup,
} from "../controllers/group.controller";

const router = Router();

router.use(verifyAccessToken);

router.route("/create").post(createGroup);
router.route("/:groupId/join").post(joinGroup);

router.route("/:groupId/delete").delete(deleteGroup);

export default router;
