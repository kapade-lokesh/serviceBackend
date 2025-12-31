import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponce";
import { authSchema } from "./auth.schema";
import {
  ApiError,
  InternalServerError,
  InvalidInput,
} from "../../utils/ApiError";
import {
  generateAccessToken,
  handleGoogleLogin,
  loginUser,
} from "./auth.service";
import { verifyGoogleIdToken } from "../../validators/verifyGoogleId";

const login = async (req: Request, res: Response) => {
  try {
    const validateData = authSchema.safeParse(req.body);

    if (!validateData.success) {
      throw new InvalidInput(validateData.error);
    }

    const response = await loginUser(validateData.data);

    res.cookie("access_token", response.accesstoken, {
      secure: false,
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", response.refreshtoken, {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(true, 201, "Login Success", {}, null));
  } catch (err: any) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(false, err.statusCode, err.message, null, err));
    }

    throw new InternalServerError();
  }
};

const getAccessToken = async (req: Request, res: Response) => {
  try {
    console.log("cookies", req.cookies);
    const refreshToken = req.cookies?.refresh_token;

    const response = await generateAccessToken(refreshToken);

    res.cookie("access_token", response.newAccessToken, {
      secure: false,
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", response.newRefreshToken, {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          "Access token refreshed successfully",
          response,
          null
        )
      );
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(409)
        .json(new ApiResponse(false, err.statusCode, err.message, null, err));
    }

    throw new InternalServerError();
  }
};

const google = async (req: Request, res: Response) => {
  try {
    const token = req.body.idToken;

    const googleUser = await verifyGoogleIdToken(token);

    const response = await handleGoogleLogin(googleUser);

    res.cookie("access_token", response.accesstoken, {
      secure: false,
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", response.refreshtoken, {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json(new ApiResponse(true, 200, "Token Found", response, null));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(409)
        .json(new ApiResponse(false, err.statusCode, err.message, null, err));
    }

    throw new InternalServerError();
  }
};
export { login, getAccessToken, google };
