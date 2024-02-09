import { asyncHandler } from "../utils/asyncHandler";
import { User, UserDocument } from "../modals/User.modal";
import { ApiResponse } from "../utils/ApiResponse";

const getAllFriends = asyncHandler(async (req, res) => {
    const user = (await User.findById(req.user._id)) as UserDocument;

    return res
        .status(200)
        .json(new ApiResponse(200, "All friends fetched", user.friends));
});

export { getAllFriends };
