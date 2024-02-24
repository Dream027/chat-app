import { asyncHandler } from "../utils/asyncHandler";
import { Group } from "../modals/Group.modal";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../modals/User.modal";
import { generateFileLink } from "../utils/generateFileLink";
import mongoose from "mongoose";
import { redis } from "../db";

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

    await redis.lpush(`groupJoined-${group._id.toString()}`, groupCreator);

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

    await redis.lpush(`groupJoined-${group._id.toString()}`, req.user._id);

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

    const redisKey = `groupJoined-${group._id.toString()}`;
    if (await redis.exists(redisKey)) {
        await redis.lrem(redisKey, 0, req.user._id);
    }

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
    await redis.del(`groupJoined-${groupId}`);

    return res
        .status(200)
        .json(new ApiResponse(200, "Group deleted successfully", group._id));
});

const searchGroupById = asyncHandler(async (req, res) => {
    const { id } = req.query;
    if (!id) {
        throw new ApiError(400, "Group id is required");
    }

    const group = await Group.findById(id);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const isMember =
        group.members.some((member) => member.toString() === req.user._id) ||
        group.admins.some((admin) => admin.toString() === req.user._id) ||
        group.groupCreator.toString() === req.user._id;

    const membersCount = group.members.length + group.admins.length + 1;

    let role = "";

    if (group.members.some((member) => member.toString() === req.user._id)) {
        role = "member";
    } else if (
        group.admins.some((admin) => admin.toString() === req.user._id)
    ) {
        role = "admin";
    } else if (group.groupCreator.toString() === req.user._id) {
        role = "creator";
    } else {
        role = "none";
    }

    return res.status(200).json(
        new ApiResponse(200, "Group found successfully", {
            _id: group._id,
            name: group.name,
            description: group.description,
            image: group.image,
            isMember,
            members: membersCount,
            role,
        })
    );
});

const updateGroupPicture = asyncHandler(async (req, res) => {
    const filename = req.file?.filename;
    if (!filename) {
        throw new ApiError(400, "Profile Picture is required");
    }

    const link = generateFileLink(filename);
    const group = await Group.findById(req.params.groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    group.image = link;
    await group.save();

    return res.status(200).json(
        new ApiResponse(200, "Group Picture updated successfully", {
            image: link,
        })
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const body = req.body;
    const validFields = ["name", "description"];

    const keys = Object.keys(body);
    if (keys.length === 0) {
        throw new ApiError(400, "At least one field is required.");
    }

    keys.forEach((key) => {
        if (!validFields.includes(key)) {
            throw new ApiError(400, "Only valid fields are accepted");
        }
    });

    await Group.updateOne({ _id: req.params.groupId }, body);

    return res
        .status(200)
        .json(new ApiResponse(200, "Group updated successfully", body));
});

const getAllGroups = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "groups",
                localField: "groups",
                foreignField: "_id",
                as: "groups",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            image: 1,
                        },
                    },
                ],
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Groups found successfully", user[0].groups)
        );
});

const getAllGroupMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const dbGroup = await Group.findById(groupId);
    if (!dbGroup) {
        throw new ApiError(404, "Group not found");
    }

    const group = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "admins",
                foreignField: "_id",
                as: "admins",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "groupCreator",
                foreignField: "_id",
                as: "groupCreator",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Group found successfully", {
            creator: group[0].groupCreator[0],
            admins: group[0].admins,
            members: group[0].members,
        })
    );
});

const getGroupMember = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isGroupMember =
        group.members.some(
            (groupMember) => groupMember.toString() === userId
        ) ||
        group.admins.some((admin) => admin.toString() === userId) ||
        group.groupCreator.toString() === userId;
    if (!isGroupMember) {
        throw new ApiError(400, "You are not a member of this group");
    }

    const role = group.members.some((member) => member.toString() === userId)
        ? "member"
        : group.admins.some((admin) => admin.toString() === userId)
        ? "admin"
        : group.groupCreator.toString() === userId
        ? "creator"
        : "none";

    return res.status(200).json(
        new ApiResponse(200, "Group member found successfully", {
            group: {
                _id: group._id,
                name: group.name,
                description: group.description,
                image: group.image,
                role,
            },
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                email: user.email,
            },
        })
    );
});

const getAllChats = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    if (!groupId) {
        throw new ApiError(400, "Chat id is required");
    }

    const chats = await redis.lrange(`groupChat-${groupId}`, 0, -1);
    const parsedChats: any[] = [];
    chats.forEach((v: any) => parsedChats.push(JSON.parse(v)));

    return res
        .status(200)
        .json(new ApiResponse(200, "Chats found successfully", parsedChats));
});

export {
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    searchGroup,
    searchGroupById,
    updateGroupPicture,
    updateProfile,
    getAllGroups,
    getAllGroupMembers,
    getGroupMember,
    getAllChats,
};
