import mongoose, { Schema, InferSchemaType, Document } from "mongoose";

const invitationSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
        },
    },
    {
        timestamps: true,
    },
);

export type InvitationModel = InferSchemaType<typeof invitationSchema> &
    Document;
export const Invitation = mongoose.model<
    InferSchemaType<typeof invitationSchema>
>("Invitation", invitationSchema);
