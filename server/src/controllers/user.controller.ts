import { User, UserDocument } from "../modals/User.modal";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../db";
import { Invitation } from "../modals/Invitation.modal";
import { generateFileLink } from "../utils/generateFileLink";
import { google } from "googleapis";
import * as people from "googleapis/build/src/apis/people";
import z from "zod";

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

    const token = uuidv4().replaceAll("-", "");
    await redis.set(
        `session-${token}`,
        JSON.stringify({
            _id: newUser._id,
            name: newUser.name,
            image: newUser.image,
            email: newUser.email,
        }),
        "EX",
        60 * 60 * 24 * 2
    );

    const url = process.env.CLIENT_URL;
    const domain = url?.split(":")[1];

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "none",
            domain: domain?.substring(2),
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

    const token = uuidv4().replaceAll("-", "");
    await redis.set(
        `session-${token}`,
        JSON.stringify({
            _id: user._id,
            name: user.name,
            image: user.image,
            email: user.email,
        }),
        "EX",
        60 * 60 * 24 * 2
    );

    const url = process.env.CLIENT_URL;
    const domain = url?.split(":")[1];

    return res
        .cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "none",
            domain: domain?.substring(2),
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
    res.status(200).json(
        new ApiResponse(200, "User session fetched successfully.", req.user)
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    const token = req.user;
    await redis.del(`session-${token}`);

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

const inviteUser = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot invite yourself");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    const dbInvitation = await Invitation.findOne({
        sender: user._id,
        receiver: friend._id,
    });
    if (dbInvitation) {
        throw new ApiError(400, "Invitation already sent");
    }

    const invitation = await Invitation.create({
        sender: user._id,
        receiver: friend._id,
    });

    friend.invitations.push(invitation._id);
    await friend.save();

    user.invitations.push(invitation._id);
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "Invitation sent successfully", {
            _id: invitation._id,
            sender: invitation.sender,
            receiver: invitation.receiver,
        })
    );
});

const deleteInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot delete your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: req.user._id,
        receiver: friend._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation deleted successfully",
                invitation._id
            )
        );
});

const acceptInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot accept your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: friend._id,
        receiver: req.user._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.friends.push(friend._id);
    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.friends.push(req.user._id as any);
    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation accepted successfully",
                invitation._id
            )
        );
});

const rejectInvitation = asyncHandler(async (req, res) => {
    const { friendId } = req.params;

    if (friendId === req.user._id) {
        throw new ApiError(400, "You cannot reject your own invitation");
    }

    const friend = (await User.findById(friendId)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    const invitation = await Invitation.findOne({
        sender: friend._id,
        receiver: req.user._id,
    });
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    user.invitations = user.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await user.save();

    friend.invitations = friend.invitations.filter(
        (invitationId: any) =>
            invitationId.toString() !== invitation._id.toString()
    );
    await friend.save();

    await Invitation.findByIdAndDelete(invitation._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitation rejected successfully",
                invitation._id
            )
        );
});

const getAllInvitations = asyncHandler(async (req, res) => {
    const invitations = await Invitation.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
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
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
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
        {
            $addFields: {
                sender: {
                    $arrayElemAt: ["$sender", 0],
                },
                receiver: {
                    $arrayElemAt: ["$receiver", 0],
                },
            },
        },
        {
            $project: {
                sender: 1,
                receiver: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Invitations fetched successfully",
                invitations
            )
        );
});

const searchFriends = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    if (email === req.user.email) {
        throw new ApiError(400, "You cannot search yourself");
    }

    const user = (await User.findOne({ email })) as UserDocument;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User found successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        })
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const body = req.body;
    const validFields = ["name", "email"];

    const keys = Object.keys(body);
    if (keys.length === 0) {
        throw new ApiError(400, "At least one field is required.");
    }

    keys.forEach((key) => {
        if (!validFields.includes(key)) {
            throw new ApiError(400, "Only valid fields are accepted");
        }
    });

    await User.updateOne({ _id: req.user._id }, body);
    req.user = {
        ...req.user,
        ...body,
    };
    await redis.set(
        `session-${req.token}`,
        JSON.stringify(req.user),
        "EX",
        60 * 60 * 24 * 2
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully", body));
});

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both passwords are required.");
    }
    if (oldPassword === newPassword) {
        throw new ApiError(400, "Both passwords cannot be same.");
    }

    const user = (await User.findById(req.user._id)) as UserDocument;

    const matchPassword = await user.comparePassword(oldPassword);
    if (!matchPassword) {
        throw new ApiError(400, "Invalid password.");
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Password updated successfully.", {}));
});

const searchFriendById = asyncHandler(async (req, res) => {
    const { id } = req.query;
    if (!id) {
        throw new ApiError(400, "Id is required");
    }

    const friend = (await User.findById(id)) as UserDocument;
    if (!friend) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User found successfully", {
            _id: friend._id,
            name: friend.name,
            email: friend.email,
            image: friend.image,
        })
    );
});

const updateProfilePicture = asyncHandler(async (req, res) => {
    const filename = req.file?.filename;
    if (!filename) {
        throw new ApiError(400, "Profile Picture is required");
    }

    const link = generateFileLink(filename);
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(400, "Login first");
    }

    user.image = link;
    await user.save();

    const rawSession = await redis.get(`session-${req.token}`);
    if (!rawSession) {
        throw new ApiError(400, "Login first");
    }

    const session = JSON.parse(rawSession);
    await redis.set(
        `session-${req.token}`,
        JSON.stringify({ ...session, image: link }),
        "EX",
        60 * 60 * 24 * 2
    );

    return res.status(200).json(
        new ApiResponse(200, "Profile Picture updated successfully", {
            image: link,
        })
    );
});

const loginWithGoogle = asyncHandler(async (req, res) => {
    if (!req.query.code) {
        throw new ApiError(400, "Failed to login");
    }

    const client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:4000/api/users/login/google",
    });

    const token = await client.getToken(req.query.code);
    const accessToken = token.tokens.access_token;
    if (!accessToken) {
        throw new ApiError(400, "Failed to login");
    }
    client.setCredentials(token.tokens);

    const peopleService = people.people({ version: "v1", auth: client });
    const response = await peopleService.people.get({
        access_token: accessToken,
        auth: client,
        resourceName: "people/me",
        personFields: "names,emailAddresses,photos",
    });

    const user = {
        name: response.data.names![0].displayName,
        email: response.data.emailAddresses![0].value,
        image: response.data.photos![0].url,
    };

    const userSchema = z.object({
        name: z.string(),
        email: z.string(),
        image: z.string(),
    });
    const parsedUser = userSchema.safeParse(user);

    if (!parsedUser.success) {
        throw new ApiError(400, "Failed to login");
    }

    const existingUser = (await User.findOne({
        email: parsedUser.data.email,
    })) as UserDocument;

    if (!existingUser) {
        const url = new URL("http://localhost:3000/signin/google");
        url.searchParams.append("email", parsedUser.data.email);
        url.searchParams.append("name", parsedUser.data.name);
        url.searchParams.append("image", parsedUser.data.image);

        return res.redirect(url.toString());
    } else {
        const token = uuidv4().replaceAll("-", "");
        await redis.set(
            `session-${token}`,
            JSON.stringify({
                _id: existingUser._id,
                name: existingUser.name,
                image: existingUser.image,
                email: existingUser.email,
            }),
            "EX",
            60 * 60 * 24 * 2
        );

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 2,
            })
            .redirect("http://localhost:3000");
    }
});

const googleCallback = asyncHandler(async (req, res) => {
    const oauth2Client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:4000/api/users/login/google",
    });

    const scopes = [
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        include_granted_scopes: true,
    });

    res.writeHead(302, {
        Location: authUrl,
    }).end();
});

const createAccountWithGoogle = asyncHandler(async (req, res) => {
    const { email, name, image } = req.query;
    if (!email || !name || !image) {
        throw new ApiError(400, "Failed to create account");
    }

    const { password } = req.body;
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const userSchema = z.object({
        name: z.string(),
        email: z.string().email("Invalid email"),
        image: z.string().refine((val) => {
            return val.startsWith("https://") || val.startsWith("http://");
        }),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });
    const parsedUser = userSchema.parse({ name, email, image, password });

    const existingUser = (await User.findOne({
        email: parsedUser.email,
    })) as UserDocument;
    if (existingUser) {
        throw new ApiError(400, "Email already exists");
    }

    const newUser = await User.create(parsedUser);
    const token = uuidv4().replaceAll("-", "");
    await redis.set(
        `session-${token}`,
        JSON.stringify({
            _id: newUser._id,
            name: newUser.name,
            image: newUser.image,
            email: newUser.email,
        }),
        "EX",
        60 * 60 * 24 * 2
    );

    return res
        .cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 2,
        })
        .json(
            new ApiResponse(200, "Account created successfully", {
                _id: newUser._id,
                name: newUser.name,
                image: newUser.image,
                email: newUser.email,
            })
        );
});

export {
    registerUser,
    loginUser,
    getSession,
    logoutUser,
    inviteUser,
    deleteInvitation,
    acceptInvitation,
    rejectInvitation,
    getAllInvitations,
    searchFriends,
    updateProfile,
    updatePassword,
    searchFriendById,
    updateProfilePicture,
    loginWithGoogle,
    googleCallback,
    createAccountWithGoogle,
};
