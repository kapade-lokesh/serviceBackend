import { Request, Response, NextFunction } from "express";
import { AuthenticationError, AuthonrizationError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";

const isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;

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

const authorizedRoles =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = req.user;

      if (!user) {
        throw new AuthonrizationError("Unauthorized");
      }

      if (!roles.includes(user.role)) {
        throw new AuthonrizationError(
          "User Not Allowed To Perform This Action"
        );
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
export { isAuthenticate, authorizedRoles };
