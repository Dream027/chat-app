export class ApiResponse implements IApiResponse {
    public success: boolean;
    constructor(
        public statusCode: number,
        public message: string,
        public data: any
    ) {
        this.success = this.statusCode >= 200 && this.statusCode < 300;
    }
}
