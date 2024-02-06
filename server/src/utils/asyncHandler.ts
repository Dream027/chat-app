import { NextFunction, RequestHandler, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { JsonWebTokenError } from "jsonwebtoken";

export function asyncHandler(
    handler: RequestHandler<any, any, any, any>
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({
                    data: null,
                    message: error.message,
                    success: false,
                });
            } else if (error instanceof JsonWebTokenError) {
                res.status(401).json({
                    data: null,
                    message: "Invalid token.",
                    success: false,
                });
            } else if (error instanceof Error) {
                res.status(500).json({
                    data: null,
                    message: error.message,
                    success: false,
                });
            }
        }
    };
}
