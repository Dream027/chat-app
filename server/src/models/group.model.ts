import mongoose, { Schema, InferSchemaType } from "mongoose";

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        adminUsers: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        groupCreator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        groupPicture: {
            type: String,
            default: "http://localhost:4000/defaultGroup.png", // Picture to be changed later
        },
        blockedUsers: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        messages: {
            type: [Schema.Types.ObjectId],
            ref: "Message",
        },
        media: {
            type: [Schema.Types.ObjectId],
            ref: "Media",
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestaps: true,
    },
);

export type GroupModel = mongoose.Document &
    InferSchemaType<typeof groupSchema>;
export const Group = mongoose.model<GroupModel>("Group", groupSchema);
