import { Request, Response } from "express";
import { userSchema } from "./user.schema";
import { createUser } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponce";
import {
  ApiError,
  InternalServerError,
  InvalidInput,
} from "../../utils/ApiError";
// create user

const registerUserController = async (req: Request, res: Response) => {
  try {
    const validateData = userSchema.safeParse(req.body);

    if (!validateData.success) {
      throw new InvalidInput(validateData.error);
    }

    const response = await createUser(validateData.data);

    return res
      .status(201)
      .json(new ApiResponse(true, 201, "User Created", response, null));
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

export { registerUserController };
