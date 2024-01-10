import { routeHandler } from "../lib/utils/routeHandler";
import { ApiError } from "../lib/utils/ApiError";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { CustomRequest } from "../types/CustomRequest";

// check and verify access token from cookies
export const verifyAccessToken = routeHandler(async (req, res, next) => {
    const authToken = req.headers?.["authorization"] as string;

    if (!authToken) {
        throw new ApiError(401, "Unauthorized access. Please login first.");
    }
    if (!authToken.startsWith("Bearer ")) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const token = authToken.split(" ")[1];
    if (!token || token === "undefined" || token === "null") {
        throw new ApiError(401, "Invalid credentials.");
    }

    const verifiedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
    ) as { _id: string };
    const user = (await User.findById(verifiedToken._id)) as UserModel;

    if (!user) {
        throw new ApiError(401, "User not found. Please login first.");
    }
    if (!user.accessToken) {
        throw new ApiError(401, "User is not logged in.");
    }
    if (user.accessToken !== token) {
        throw new ApiError(
            402,
            "Your token has been corrupted. Try logout and logging in.",
        );
    }
    (req as CustomRequest).user = user;
    return next();
});
