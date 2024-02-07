import { Request } from "express";

declare module "express" {
    export interface Request {
        user: string;
    }
}

declare module "express-serve-static-core" {
    export interface Request {
        user: string;
    }
}
