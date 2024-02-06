import { User, UserDocument } from "../modals/User.modal";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(401, "All fields are required.");
    }

    const user = await User.findOne({
        name,
        email,
    });
    if (user) {
        throw new ApiError(401, "User is already existing.");
    }

    const newUser = (await User.create({
        name,
        email,
        password,
    })) as UserDocument;

    const token = newUser.generateAccessToken();

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 365,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        .status(200)
        .json(
            new ApiResponse(200, "User created successfully.", {
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    image: newUser.image,
                    email: newUser.email,
                },
            })
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    const user = (await User.findOne({
        email,
    })) as UserDocument;
    if (!user) {
        throw new ApiError(400, "No user with such email is existing.");
    }

    const isSamePassword = await user.comparePassword(password);
    if (!isSamePassword) {
        throw new ApiError(400, "Wrong password.");
    }

    const token = user.generateAccessToken();

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 365,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        .status(200)
        .json(
            new ApiResponse(200, "User logged in successfully.", {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    image: user.image,
                    email: user.email,
                },
            })
        );
});

const getSession = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json(
        new ApiResponse(200, "User session fetched successfully.", {
            _id: user?._id,
            name: user?.name,
            image: user?.image,
            email: user?.email,
        })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    return res
        .cookie("token", "", {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            expires: new Date(0),
        })
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully.", {}));
});

export { registerUser, loginUser, getSession, logoutUser };
