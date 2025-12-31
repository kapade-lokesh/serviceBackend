import { Router } from "express";
import {
  ProfileUserController,
  registerUserController,
  updateUserProfileContoller,
} from "./user.controller";
import {
  authorizedRoles,
  isAuthenticate,
} from "../../middlewares/authmiddleware";
import { Role } from "../../generated/prisma/enums";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/update", isAuthenticate, updateUserProfileContoller);
userRouter.get(
  "/getProfile",
  isAuthenticate,
  authorizedRoles([Role.CUSTOMER, Role.PROVIDER]),
  ProfileUserController
);

export default userRouter;
