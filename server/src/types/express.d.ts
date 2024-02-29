import { Request } from "express";

declare module "express" {
    export interface Request {
        user: {
            _id: string;
            name: string;
            email: string;
            image: string;
            password: string;
        };
        token: string;
    }
}

declare module "express-serve-static-core" {
    export interface Request {
        user: {
            _id: string;
            name: string;
            email: string;
            image: string;
            password: string;
        };
        token: string;
    }
}
