import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";

const isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;
    console.log("req.cookies", req.cookies);
    if (!token) {
      throw new AuthenticationError("Token Not Found");
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new AuthenticationError("Invalid Token");
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new AuthenticationError("Token Expire"));
    }
    next(err);
  }
};
export { isAuthenticate };
