import { routeHandler } from "../lib/utils/routeHandler";
import { ApiError } from "../lib/utils/ApiError";
import { User, UserModel } from "../models/user.model";
import { ApiResponse } from "../lib/utils/ApiResponse";
import { CustomRequest } from "../types/CustomRequest";
import { verifyObjectEntries } from "../lib/utils/verifyObjectEntries";
import { Invitation } from "../models/invitation.model";

const registerUser = routeHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        throw new ApiError(400, "All fields are required.");
    }
    const user = await User.findOne({
        email,
    });

    if (user) {
        throw new ApiError(
            400,
            "User with same email is already existing. Try login.",
        );
    }

    await User.create({
        email,
        password,
        name,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "User created successfully.", {}));
});

const loginUser = routeHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }
    const user = (await User.findOne({
        email,
    })) as UserModel;
    if (!user) {
        throw new ApiError(400, "User with given email doesn't exist.");
    }

    if (!user.matchPassword(password)) {
        throw new ApiError(400, "Invalid password.");
    }

    const accessToken = await user.generateAccessToken();
    return res.status(200).json(
        new ApiResponse(200, "User logged in successfully.", {
            token: accessToken,
        }),
    );
});

const logoutUser = routeHandler(async (req, res) => {
    const userId = (req as CustomRequest).user?._id;
    const dbUser = (await User.findById(userId)) as UserModel;

    dbUser.accessToken = "";
    await dbUser.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully.", {}));
});

const getSession = routeHandler(async (req, res) => {
    const user = (req as CustomRequest).user;

    return res.status(200).json(
        new ApiResponse(200, "User data fetched successfully.", {
            user: {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                status: user?.status,
                image: user?.profilePicture,
            },
        }),
    );
});

const updateUser = routeHandler(async (req, res) => {
    const { data } = req.body;
    if (!data) {
        throw new ApiError(400, "Data to update is required.");
    }
    if (!verifyObjectEntries(data, ["name", "status"])) {
        throw new ApiError(400, "Invalid data to update.");
    }

    const user = (req as CustomRequest).user;
    const dbUser = await User.findOneAndUpdate(user?._id, data);
    if (!dbUser) {
        throw new ApiError(400, "User not found. Try again.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully.", {}));
});

const getInvitations = routeHandler(async (req, res) => {
    const user = (await User.findById(
        (req as CustomRequest).user?._id,
    )) as UserModel;
    if (!user) {
        throw new ApiError(400, "User not found. Try again.");
    }

    const invitations = await Invitation.aggregate([
        {
            $match: {
                _id: {
                    $in: user.invitations,
                },
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
                            name: 1,
                            email: 1,
                            image: 1,
                            status: 1,
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
                            name: 1,
                            email: 1,
                            image: 1,
                            status: 1,
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

    return res.status(200).json(
        new ApiResponse(200, "Invitations fetched successfully.", {
            invitations,
        }),
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getSession,
    updateUser,
    getInvitations,
};
