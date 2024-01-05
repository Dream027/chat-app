import { Request, Response, NextFunction, RequestHandler } from "express";

export function routeHandler(
    fn: (req: Request, res: Response, next: NextFunction) => any,
): RequestHandler<any, any, any, any> {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (e: any) {
            res.status(e.statusCode || 500).json({
                success: false,
                message: e.message,
                data: null,
            });
        }
    };
}
