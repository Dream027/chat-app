import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { redis } from "../db";

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(400, "Please login first.");
    }

    const dbUser = await redis.get(`session-${token}`);
    if (!dbUser) {
        throw new ApiError(400, "Invalid credentials.");
    }

    req.user = JSON.parse(dbUser);
    req.token = token;
    next();
});
