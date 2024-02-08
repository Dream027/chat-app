import { Request } from "express";

declare module "express" {
    export interface Request {
        user: {
            _id: string;
            name: string;
            email: string;
            image: string;
        };
    }
}

declare module "express-serve-static-core" {
    export interface Request {
        user: {
            _id: string;
            name: string;
            email: string;
            image: string;
        };
    }
}
