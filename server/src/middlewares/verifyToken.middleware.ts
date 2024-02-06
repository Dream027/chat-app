import { User } from "../modals/User.modal";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(400, "Please login first.");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!!) as string;
    if (!decodedToken) {
        throw new ApiError(400, "Invalid credentials.");
    }

    const dbUser = await User.findById(decodedToken);
    if (!dbUser) {
        throw new ApiError(400, "Invalid credentials.");
    }

    req.user = { _id: decodedToken };
    next();
});
