import { Request, Response } from "express";
import { profileSchema, updateUSerSchema, userSchema } from "./user.schema";
import { createUser, getProfile, updateUser } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponce";
import {
  ApiError,
  InternalServerError,
  InvalidInput,
} from "../../utils/ApiError";
import { tosafeUser } from "../../utils/toSafeUser";
// create user

const registerUserController = async (req: Request, res: Response) => {
  try {
    const validateData = userSchema.safeParse(req.user?.id);

    if (!validateData.success) {
      throw new InvalidInput(validateData.error);
    }

    const response = await createUser(validateData.data);

    return res
      .status(201)
      .json(
        new ApiResponse(true, 201, "User Created", tosafeUser(response), null)
      );
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

const ProfileUserController = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const validateData = profileSchema.safeParse(req.user);

    if (!validateData.success) {
      throw new InvalidInput(validateData.error);
    }

    const response = await getProfile(validateData.data);

    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          210,
          "Profile Accessed",
          tosafeUser(response),
          null
        )
      );
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

const updateUserProfileContoller = async (req: Request, res: Response) => {
  try {
    const validateData = updateUSerSchema.safeParse(req.body);
    if (!validateData.success) {
      throw new InvalidInput(validateData.error);
    }

    const response = await updateUser({
      id: req.user?.id as string,
      data: validateData.data,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          "User Profile Updated",
          tosafeUser(response),
          null
        )
      );
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
export {
  registerUserController,
  ProfileUserController,
  updateUserProfileContoller,
};
