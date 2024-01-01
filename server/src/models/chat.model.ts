import mongoose, { Schema, InferSchemaType } from "mongoose";

const chatSchema = new Schema(
    {
        messages: {
            type: [Schema.Types.ObjectId],
            ref: "Message",
        },
        media: {
            type: [Schema.Types.ObjectId],
            ref: "Media",
        },
        users: {
            type: [Schema.Types.ObjectId],
            ref: "User",
        },
        unreadMessages: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export type ChatModel = mongoose.Document & InferSchemaType<typeof chatSchema>;
export const Chat = mongoose.model<ChatModel>("Chat", chatSchema);
