import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        groups: {
            type: [Schema.Types.ObjectId],
            ref: "Group",
        },
        profilePicture: {
            type: String,
            default: "http://localhost:4000/defaultProfile.png", // Picture to be changed later
        },
        status: {
            type: String,
            default: "Available",
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        blockedUsers: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        blockedBy: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        receivedRequest: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        sentRequest: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        joinedUsers: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

export type UserModel = mongoose.Document & InferSchemaType<typeof userSchema>;
export const User = mongoose.model<UserModel>("User", userSchema);
