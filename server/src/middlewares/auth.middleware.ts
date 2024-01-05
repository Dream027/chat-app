import { routeHandler } from "../lib/utils/routeHandler";
import { ApiError } from "../lib/utils/ApiError";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { CustomRequest } from "../types/CustomRequest";

// check and verify access token from cookies
export const verifyAccessToken = routeHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    console.log(req.path);
    if (!token) {
        throw new ApiError(401, "Unauthorized access. Please login first.");
    }
    const verifiedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
    ) as { _id: string };
    const user = (await User.findById(verifiedToken._id)) as UserModel;
    if (!user.accessToken) {
        throw new ApiError(401, "User is not logged in.");
    }
    if (user.accessToken !== token) {
        throw new ApiError(
            402,
            "Your token has been corrupted. Try logout and logging in.",
        );
    }
    (req as CustomRequest).user = { _id: user._id };
    return next();
});
