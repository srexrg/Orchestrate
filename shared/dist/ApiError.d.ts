declare class ApiError extends Error {
    statusCode: number;
    success: boolean;
    errors: any[];
    constructor(statusCode: number, message?: string, errors?: never[], stack?: string);
}
export default ApiError;
export { ApiError };
