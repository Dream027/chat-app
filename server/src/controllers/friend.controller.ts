import { asyncHandler } from "../utils/asyncHandler";
import { User, UserDocument } from "../modals/User.modal";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { redis } from "../db";

const getAllFriends = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "friends",
                foreignField: "_id",
                as: "friends",
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
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, "All friends fetched", user[0].friends));
});

const getAllChats = asyncHandler(async (req, res) => {
    const { chatId } = req.query;
    if (!chatId) {
        throw new ApiError(400, "Chat id is required");
    }

    const chats = await redis.lrange(`chat-${chatId}`, 0, -1);
    const parsedChats: any[] = [];
    chats.forEach((v) => parsedChats.push(JSON.parse(v)));

    return res
        .status(200)
        .json(new ApiResponse(200, "Chats fetched successfully", parsedChats));
});

export { getAllFriends, getAllChats };
