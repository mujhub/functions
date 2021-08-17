import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
	statusCode: any;
	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const throwError = (code: number, message: string) => {
	throw new CustomError(code, message);
};

export const ErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
	res.status(err.statusCode).json({ status: "error", message: err.message });
};
