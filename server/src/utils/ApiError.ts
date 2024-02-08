export class ApiError extends Error implements IApiResponse {
    public data = null;
    public success = false;

    constructor(public statusCode: number, public message: string) {
        super(message);
    }
}
