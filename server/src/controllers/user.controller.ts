import { User, UserDocument } from "../modals/User.modal";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../db";
import { Invitation } from "../modals/Invitation.modal";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(401, "All fields are required.");
    }

    const user = await User.findOne({
        name,
        email,
    });
    if (user) {
        throw new ApiError(401, "User is already existing.");
    }

    const newUser = (await User.create({
        name,
        email,
        password,
    })) as UserDocument;

    const token = uuidv4().replaceAll("-", "");
    await redis.set(
        `session-${token}`,
        JSON.stringify({
            _id: newUser._id,
            name: newUser.name,
            image: newUser.image,
            email: newUser.email,
        }),
        "EX",
        60 * 60 * 24 * 2
    );

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        .status(200)
        .json(
            new ApiResponse(200, "User created successfully.", {
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    image: newUser.image,
                    email: newUser.email,
                },
            })
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    const user = (await User.findOne({
        email,
    })) as UserDocument;
    if (!user) {
        throw new ApiError(400, "No user with such email is existing.");
    }

    const isSamePassword = await user.comparePassword(password);
    if (!isSamePassword) {
        throw new ApiError(400, "Wrong password.");
    }

    const token = uuidv4().replaceAll("-", "");
    await redis.set(
        `session-${token}`,
        JSON.stringify({
            _id: user._id,
            name: user.name,
            image: user.image,
            email: user.email,
        }),
        "EX",
        60 * 60 * 24 * 2
    );

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        .status(200)
        .json(
            new ApiResponse(200, "User logged in successfully.", {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    image: user.image,
                    email: user.email,
                },
            })
        );
});

const getSession = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "User session fetched successfully.", req.user)
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    const token = req.user;
    await redis.del(`session-${token}`);

    return res
        .cookie("token", "", {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            expires: new Date(0),
        })
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully.", {}));
});

const inviteUser = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot invite yourself");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    const dbInvitation = await Invitation.findOne({
        sender: user._id,
        receiver: friend._id,
    });
    if (dbInvitation) {
        throw new ApiError(400, "Invitation already sent");
    }

    const invitation = await Invitation.create({
        sender: user._id,
        receiver: friend._id,
    });

    friend.invitations.push(invitation._id);
    await friend.save();

    user.invitations.push(invitation._id);
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "Invitation sent successfully", {
            _id: invitation._id,
            sender: invitation.sender,
            receiver: invitation.receiver,
        })
    );
});

const deleteInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot delete your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: req.user._id,
        receiver: friend._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation deleted successfully",
                invitation._id
            )
        );
});

const acceptInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot accept your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: friend._id,
        receiver: req.user._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.friends.push(friend._id);
    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.friends.push(req.user._id as any);
    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation accepted successfully",
                invitation._id
            )
        );
});

const rejectInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot reject your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: friend._id,
        receiver: req.user._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation rejected successfully",
                invitation._id
            )
        );
});

const getAllInvitations = asyncHandler(async (req, res) => {
    const invitations = await Invitation.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            image: 1,
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
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            image: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                sender: {
                    $arrayElemAt: ["$sender", 0],
                },
                receiver: {
                    $arrayElemAt: ["$receiver", 0],
                },
            },
        },
        {
            $project: {
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
                "Invitations fetched successfully",
                invitations
            )
        );
});

const searchFriends = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    if (email === req.user.email) {
        throw new ApiError(400, "You cannot search yourself");
    }

    const user = (await User.findOne({ email })) as UserDocument;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User found successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        })
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const body = req.body;
    const validFields = ["name", "email"];

    const keys = Object.keys(body);
    if (keys.length === 0) {
        throw new ApiError(400, "At least one field is required.");
    }

    keys.forEach((key) => {
        if (!validFields.includes(key)) {
            throw new ApiError(400, "Only valid fields are accepted");
        }
    });

    await User.updateOne({ _id: req.user._id }, body);

    return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully", body));
});

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both passwords are required.");
    }
    if (oldPassword === newPassword) {
        throw new ApiError(400, "Both passwords cannot be same.");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    const matchPassword = await user.comparePassword(oldPassword);
    if (!matchPassword) {
        throw new ApiError(400, "Invalid password.");
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Password updated successfully.", {}));
});

export {
    registerUser,
    loginUser,
    getSession,
    logoutUser,
    inviteUser,
    deleteInvitation,
    acceptInvitation,
    rejectInvitation,
    getAllInvitations,
    searchFriends,
    updateProfile,
    updatePassword,
};
