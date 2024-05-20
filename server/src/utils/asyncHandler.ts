import { NextFunction, RequestHandler, Request, Response } from "express";
import { ApiError } from "./ApiError";
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
                    statusCode: error.statusCode,
                });
            } else if (error instanceof JsonWebTokenError) {
                res.status(402).json({
                    data: null,
                    message: error.message,
                    success: false,
                    statusCode: 402,
                });
            } else if (error instanceof Error) {
                console.log(error);
                res.status(500).json({
                    data: null,
                    message: error.message,
                    success: false,
                    statusCode: 500,
                });
            } else {
                res.status(500).json({
                    data: null,
                    message: "Something went wrong",
                    success: false,
                    statusCode: 500,
                });
            }
        }
    };
}
