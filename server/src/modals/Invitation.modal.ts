import mongoose from "mongoose";

interface Invitation extends mongoose.Document {
    sender: mongoose.Schema.Types.ObjectId;
    receiver: mongoose.Schema.Types.ObjectId;
    group: mongoose.Schema.Types.ObjectId;
}

const invitationSchema = new mongoose.Schema<Invitation>(
    {
        sender: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export interface InvitationDocument extends Invitation, mongoose.Document {}
export default mongoose.model<InvitationDocument>(
    "Invitation",
    invitationSchema
);
