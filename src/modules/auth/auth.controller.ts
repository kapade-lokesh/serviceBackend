import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponce";
import { authSchema } from "./auth.schema";
import {
  ApiError,
  InternalServerError,
  InvalidInput,
} from "../../utils/ApiError";
import { loginUser } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("calling login...");
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

    res.cookie("refreh_token", response.refreshtoken, {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, 
    });

    res.status(200).json(new ApiResponse(true, 201, "Login Success", {}, null));
  } catch (err: any) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(409)
        .json(new ApiResponse(false, err.statusCode, err.message, null, err));
    }

    throw new InternalServerError();
  }
};
