import mongoose, { Schema, InferSchemaType } from "mongoose";

const mediaSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["image", "video"],
        },
        url: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export type MediaModel = InferSchemaType<typeof mediaSchema>;
export const Media = mongoose.model<MediaModel>("Media", mediaSchema);
