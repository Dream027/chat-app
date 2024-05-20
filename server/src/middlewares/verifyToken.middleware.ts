import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { redis } from "../db";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(400, "Please login first.");
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        _id: string;
    };
    const dbUser = await redis.get(`session-${verifiedToken._id}`);
    if (!dbUser) {
        throw new ApiError(400, "Invalid credentials.");
    }

    req.user = JSON.parse(dbUser);
    req.token = verifiedToken._id;
    next();
});
