import mongoose, { Schema, InferSchemaType, Document } from "mongoose";

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

export type ChatModel = InferSchemaType<typeof chatSchema> & Document;
export const Chat = mongoose.model<InferSchemaType<typeof chatSchema>>(
    "Chat",
    chatSchema,
);
