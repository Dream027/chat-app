import { asyncHandler } from "../utils/asyncHandler";
import { Group } from "../modals/Group.modal";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../modals/User.modal";

const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Both Group name and description are required");
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
        throw new ApiError(400, "Group already exists");
    }

    const groupCreator = req.user._id;

    const group = await Group.create({ name, description, groupCreator });

    const user = await User.findById(groupCreator);

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.groups.push(group._id);
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "Group created successfully", {
            _id: group._id,
            name: group.name,
            description: group.description,
            image: group.image,
        })
    );
});

const searchGroup = asyncHandler(async (req, res) => {
    const { name } = req.query;
    if (!name) {
        throw new ApiError(400, "Group name is required");
    }

    const group = await Group.findOne({ name });
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Group fetched successfully", {
            _id: group._id,
            name: group.name,
            description: group.description,
            image: group.image,
        })
    );
});

const joinGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const isAlreadyJoined =
        group.members.some((member) => member.toString() === req.user._id) ||
        group.admins.some((admin) => admin.toString() === req.user._id) ||
        group.groupCreator.toString() === req.user._id;
    if (isAlreadyJoined) {
        throw new ApiError(400, "You have already joined this group");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.groups.push(group._id);
    await user.save();

    group.members.push(req.user._id as any);
    await group.save();

    return res.status(200).json(
        new ApiResponse(200, "Group joined successfully", {
            _id: group._id,
            name: group.name,
            description: group.description,
            image: group.image,
        })
    );
});

const leaveGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    if (group.groupCreator.toString() === req.user._id) {
        throw new ApiError(400, "You cannot leave a group you created");
    }

    const isGroupMember =
        group.members.some((member) => member.toString() === req.user._id) ||
        group.admins.some((admin) => admin.toString() === req.user._id);
    if (!isGroupMember) {
        throw new ApiError(400, "You are not a member of this group");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMember = group.members.some(
        (groupMember) => groupMember.toString() === user._id.toString()
    );
    if (isMember) {
        console.log("member");
        group.members = group.members.filter(
            (member) => member.toString() !== user._id.toString()
        );
    }

    const isAdmin = group.admins.some(
        (admin) => admin.toString() === user._id.toString()
    );
    if (isAdmin) {
        group.admins = group.admins.filter(
            (admin) => admin.toString() !== user._id.toString()
        );
    }
    await group.save();

    user.groups = user.groups.filter((group) => group.toString() !== groupId);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Group left successfully", group._id));
});

const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    if (group.groupCreator.toString() !== req.user._id) {
        throw new ApiError(403, "You are not authorized to delete this group");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.groups = user.groups.filter(
        (groupId) => groupId.toString() !== group._id.toString()
    );
    await user.save();

    for (const member of group.members) {
        const memberUser = await User.findById(member);
        if (memberUser) {
            memberUser.groups = memberUser.groups.filter(
                (group) => group.toString() !== groupId
            );
            await memberUser.save();
        }
    }

    for (const member of group.admins) {
        const memberUser = await User.findById(member);
        if (memberUser) {
            memberUser.groups = memberUser.groups.filter(
                (group) => group.toString() !== groupId
            );
            await memberUser.save();
        }
    }

    await Group.findByIdAndDelete(groupId);

    return res
        .status(200)
        .json(new ApiResponse(200, "Group deleted successfully", group._id));
});

export { createGroup, joinGroup, leaveGroup, deleteGroup, searchGroup };
