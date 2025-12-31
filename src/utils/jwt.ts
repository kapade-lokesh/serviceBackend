import jwt from "jsonwebtoken";
import { AuthenticationError } from "./ApiError";

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: string;
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  if (!decoded) {
    throw new AuthenticationError("Invalid access token");
  }

  // 🔐 NARROWING STEP

  if (typeof decoded === "string") {
    throw new AuthenticationError("Invalid access token");
  }

  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
};
