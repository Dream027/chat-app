import { routeHandler } from "../lib/utils/routeHandler";
import { CustomRequest } from "../types/CustomRequest";
import { User, UserModel } from "../models/user.model";
import { ApiError } from "../lib/utils/ApiError";
import { Group, GroupModel } from "../models/group.model";
import { ApiResponse } from "../lib/utils/ApiResponse";

const createGroup = routeHandler(async (req, res) => {
    const { name } = req.body;
    const user = (req as CustomRequest).user;

    const dbGroup = await Group.findOne({ name });
    if (dbGroup) {
        throw new ApiError(400, "Group already exists.");
    }

    const dbUser = (await User.findById(user?._id)) as UserModel;
    if (!dbUser) {
        throw new ApiError(400, "Login first.");
    }

    const group = await Group.create({
        name,
        groupCreator: dbUser._id,
    });
    dbUser.groups.push(group._id);
    await dbUser.save();

    return res
        .status(201)
        .json(new ApiResponse(201, "Group created successfully.", group));
});

const deleteGroup = routeHandler(async (req, res) => {
    const { groupId } = req.params;
    const group = (await Group.findById(groupId)) as GroupModel;
    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const user = (req as CustomRequest).user;
    if (!user) {
        throw new ApiError(400, "Login first.");
    }

    if (
        group.groupCreator?.toString() !== user?._id.toString() ||
        group.adminUsers.some((id) => id.toString() === user._id)
    ) {
        throw new ApiError(400, "You are not authorized to delete this group.");
    }

    const allMembers = [
        group.groupCreator,
        ...group.members,
        ...group.adminUsers,
    ];
    for (const member of allMembers) {
        if (!member) continue;
        const dbUser = (await User.findById(member)) as UserModel;
        dbUser.groups = dbUser.groups.filter((id) => id.toString() !== groupId);
        await dbUser.save();
    }

    const deletedGroup = await Group.findByIdAndDelete(groupId);
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Group deleted successfully.", deletedGroup),
        );
});

export { createGroup, deleteGroup };
