import mongoose, { Schema, InferSchemaType, Document } from "mongoose";

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

export type MediaModel = InferSchemaType<typeof mediaSchema> & Document;
export const Media = mongoose.model<InferSchemaType<typeof mediaSchema>>(
    "Media",
    mediaSchema,
);
