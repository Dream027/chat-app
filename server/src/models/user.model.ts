import mongoose, { Schema, InferSchemaType, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        groups: {
            type: [Schema.Types.ObjectId],
            ref: "Group",
        },
        profilePicture: {
            type: String,
            default: "http://localhost:4000/avatar.png", // Picture to be changed later
        },
        status: {
            type: String,
            default: "Available",
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        blockedUsers: {
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
        accessToken: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET!!,
    );
};

userSchema.methods.matchOtp = function (otp: string) {
    if (this.otp === otp) {
        this.otp = "";
        return true;
    }
    return false;
};

userSchema.methods.matchPassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export type UserModel = Document &
    InferSchemaType<typeof userSchema> & {
        generateAccessToken: () => string;
        matchPassword: (password: string) => boolean;
    };
export const User = mongoose.model<UserModel>("User", userSchema);
