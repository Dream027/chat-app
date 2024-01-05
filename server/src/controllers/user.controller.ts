import { routeHandler } from "../lib/utils/routeHandler";
import { ApiError } from "../lib/utils/ApiError";
import { User, UserModel } from "../models/user.model";
import { ApiResponse } from "../lib/utils/ApiResponse";
import { CustomRequest } from "../types/CustomRequest";

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
    const user = (await User.findOne({
        email,
    })) as UserModel;
    if (!user) {
        throw new ApiError(400, "User with given mobile number doesn't exist.");
    }

    if (!user.matchPassword(password)) {
        throw new ApiError(400, "Invalid password.");
    }

    const accessToken = user.generateAccessToken();
    return res
        .status(200)
        .json(new ApiResponse(200, "User logged in successfully.", {}))
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });
});

const logoutUser = routeHandler(async (req, res) => {
    const userId = (req as CustomRequest).user?._id;
    const dbUser = (await User.findById(userId)) as UserModel;

    dbUser.accessToken = "";
    await dbUser.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully.", {}))
        .clearCookie("accessToken");
});

export { registerUser, loginUser, logoutUser };
