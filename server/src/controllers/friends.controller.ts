import { routeHandler } from "../lib/utils/routeHandler";
import { CustomRequest } from "../types/CustomRequest";
import { ApiResponse } from "../lib/utils/ApiResponse";
import { User, UserModel } from "../models/user.model";
import { ApiError } from "../lib/utils/ApiError";
import { Invitation, InvitationModel } from "../models/invitation.model";
import mongoose from "mongoose";

const getAllFriends = routeHandler(async (req, res) => {
    const user = (req as CustomRequest).user;

    const dbUser = await User.aggregate([
        {
            $match: {
                _id: user?._id,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "joinedUsers",
                foreignField: "_id",
                as: "joinedUsers",
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Fetched user friends successfully.", {
            friends: dbUser[0].joinedUsers,
        }),
    );
});

const inviteFriend = routeHandler(async (req, res) => {
    const { friendId } = req.params;

    if (!friendId) {
        throw new ApiError(400, "Friend id is required.");
    }
    const user = (req as CustomRequest)?.user;

    const friend = (await User.findById(friendId)) as UserModel;
    if (!friend) {
        throw new ApiError(400, "Friend does not exist.");
    }

    const dbInvitation = await Invitation.findOne({
        sender: user?._id,
        receiver: friend._id,
    });
    if (dbInvitation) {
        throw new ApiError(400, "User is already sent invitation.");
    }

    const dbUser = (await User.findById(user?._id)) as UserModel;

    const invitation = await Invitation.create({
        sender: user?._id,
        receiver: friend._id,
    });

    dbUser.invitations.push(invitation._id);
    await dbUser.save();

    friend.invitations.push(invitation._id);
    await friend.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Invitation sent successfully.", {}));
});

const getFriendProfile = routeHandler(async (req, res) => {
    const { friendId } = req.params;
    if (!friendId) {
        throw new ApiError(400, "Friend id is required.");
    }

    const friend = (await User.findById(friendId)) as UserModel;
    if (!friend) {
        throw new ApiError(400, "Friend does not exist.");
    }

    const user = (await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(
                    (req as CustomRequest).user?._id,
                ),
            },
        },
        {
            $lookup: {
                from: "invitations",
                localField: "invitations",
                foreignField: "_id",
                as: "invitations",
                pipeline: [
                    {
                        $match: {
                            $or: [
                                {
                                    sender: friend._id,
                                },
                                {
                                    receiver: friend._id,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "joinedUsers",
                foreignField: "_id",
                as: "joinedUsers",
                pipeline: [
                    {
                        $match: {
                            _id: friend.id,
                        },
                    },
                    {
                        $project: {
                            name: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                invitations: 1,
                joinedUsers: 1,
            },
        },
    ])) as {
        invitations: any[];
        joinedUsers: any[];
    }[];

    if (user[0].invitations.length === 0 && user[0].joinedUsers.length === 0) {
        throw new ApiError(400, "Friend does not exist.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Fetched friend profile successfully.", {
            friend: {
                _id: friend._id,
                name: friend.name,
                email: friend.email,
                image: friend.profilePicture,
                lastSeen: friend.lastSeen,
                status: friend.status,
            },
        }),
    );
});

const inviteFriendByEmail = routeHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Friend id is required.");
    }
    if (email === (req as CustomRequest).user?.email) {
        throw new ApiError(400, "Cannot send invitation to yourself.");
    }

    const friend = (await User.findOne({ email })) as UserModel;
    if (!friend) {
        throw new ApiError(404, "Friend not found.");
    }

    const user = (await User.findById(
        (req as CustomRequest).user?._id,
    )) as UserModel;
    if (!user) {
        throw new ApiError(401, "Please login first.");
    }

    const dbInvitation = await Invitation.findOne({
        sender: user?._id,
        receiver: friend._id,
    });
    if (dbInvitation) {
        throw new ApiError(400, "User is already sent invitation.");
    }

    const invitation = await Invitation.create({
        sender: user?._id,
        receiver: friend._id,
    });

    user.invitations.push(invitation._id);
    await user.save();

    friend.invitations.push(invitation._id);
    await friend.save();

    const invitationToSend = await Invitation.aggregate([
        {
            $match: {
                _id: invitation._id,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $addFields: {
                            image: "$profilePicture",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            image: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
                pipeline: [
                    {
                        $addFields: {
                            image: "$profilePicture",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            image: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                sender: {
                    $first: "$sender",
                },
                receiver: {
                    $first: "$receiver",
                },
            },
        },
        {
            $project: {
                _id: 1,
                sender: 1,
                receiver: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation sent successfully.",
                invitationToSend,
            ),
        );
});

export { getAllFriends, inviteFriend, getFriendProfile, inviteFriendByEmail };
