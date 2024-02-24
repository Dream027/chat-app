import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
    createGroup,
    deleteGroup,
    getAllChats,
    getAllGroupMembers,
    getAllGroups,
    getGroupMember,
    joinGroup,
    leaveGroup,
    searchGroup,
    searchGroupById,
    updateGroupPicture,
    updateProfile,
} from "../controllers/group.controller";
import { upload } from "../multer.config";

const router = Router();

router.use(verifyToken);

router.route("/search").get(searchGroup);
router.route("/").get(searchGroupById);
router.route("/all").get(getAllGroups);
router.route("/:groupId/members").get(getAllGroupMembers);
router.route("/:groupId/members/:userId").get(getGroupMember);
router.route("/chats/:groupId").get(getAllChats);

router.route("/create").post(createGroup);
router.route("/:groupId/join").post(joinGroup);
router.route("/:groupId/leave").post(leaveGroup);
router
    .route("/:groupId/image")
    .put(upload.single("groupPicture"), updateGroupPicture);
router.route("/:groupId/profile").put(updateProfile);

router.route("/:groupId").delete(deleteGroup);

export default router;
