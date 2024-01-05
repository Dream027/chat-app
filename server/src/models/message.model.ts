import mongoose, { Schema, InferSchemaType } from "mongoose";

const messageSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["text", "media"],
            default: "text",
        },
        media: {
            type: Schema.Types.ObjectId,
            ref: "Media",
        },
        content: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
        },
        isForwarded: {
            type: Boolean,
            default: false,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

export type MessageModel = InferSchemaType<typeof messageSchema>;
export const Message = mongoose.model<MessageModel>("Message", messageSchema);
