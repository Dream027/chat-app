import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
    email: string;
    password: string;
    name: string;
    image: string;
    blockedUsers: mongoose.Schema.Types.ObjectId[];
    invitations: mongoose.Schema.Types.ObjectId[];
    friends: mongoose.Schema.Types.ObjectId[];
}

export interface UserDocument extends User, mongoose.Document {
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (v: string) =>
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                        v
                    ),
                message: (props) =>
                    `${props.value} is not a valid email address!`,
            },
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be at least 6 characters long"],
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
            default: "/avatar.png",
        },
        blockedUsers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        invitations: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Invitation",
            default: [],
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!);
};

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
