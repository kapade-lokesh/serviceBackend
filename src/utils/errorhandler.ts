import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponce";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      new ApiResponse(false, err.statusCode, err.message, null, {
        code: err.statusCode ?? err.name,
        message: err.message ?? null,
      })
    );
  }

  // Fallback for unexpected errors
  return res.status(500).json(
    new ApiResponse(false, 500, "Internal Server Error", null, {
      code: 500,
      message: err?.message ?? err,
    })
  );
}
