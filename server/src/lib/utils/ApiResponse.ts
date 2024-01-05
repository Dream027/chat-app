import { IApiResponse } from "./IApiResponse";

export class ApiResponse implements IApiResponse {
    constructor(
        public statusCode: number,
        public message: string,
        public data: any,
    ) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
    public success = this.statusCode < 400;
}
