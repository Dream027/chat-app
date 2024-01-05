import { IApiResponse } from "./IApiResponse";

export class ApiError extends Error implements IApiResponse {
    constructor(
        public statusCode: number,
        public message: string = "Something went wrong",
    ) {
        super(message);
        this.statusCode = statusCode;
    }
    public success = false;
    public data = null;
}
