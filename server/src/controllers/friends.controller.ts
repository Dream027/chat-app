import { routeHandler } from "../lib/utils/routeHandler";
import { CustomRequest } from "../types/CustomRequest";
import { ApiResponse } from "../lib/utils/ApiResponse";

const getAllFriends = routeHandler(async (req, res) => {
    const user = (req as CustomRequest).user;

    return res.send(200).json(
        new ApiResponse(200, "Fetched user friends successfully.", {
            friends: user?.joinedUsers,
        }),
    );
});

export { getAllFriends };
