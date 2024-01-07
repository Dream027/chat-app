import { Request } from "express";
import { UserModel } from "../models/user.model";

export interface CustomRequest extends Request {
    user?: UserModel;
}
