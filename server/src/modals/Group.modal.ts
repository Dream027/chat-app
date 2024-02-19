import mongoose, { Schema, Document } from "mongoose";

export interface GroupDocument extends Document, Group {}

interface Group {
    name: string;
    description?: string;
    members: mongoose.Schema.Types.ObjectId[];
    admins: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    image: string;
    groupCreator: mongoose.Schema.Types.ObjectId;
}

const groupSchema = new Schema<GroupDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 10,
        },
        groupCreator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        admins: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        image: {
            type: String,
            default: "/avatar.png",
        },
    },
    {
        timestamps: true,
    }
);

export const Group = mongoose.model<GroupDocument>("Group", groupSchema);
