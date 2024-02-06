import { Request } from "express";

declare module "express" {
    export interface Request {
        user: {
            _id: string;
        };
    }
}

declare module "express-serve-static-core" {
    export interface Request {
        user: {
            _id: string;
        };
    }
}
