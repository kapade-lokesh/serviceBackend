import { Router } from "express";
import { getProfile, registerUserController } from "./user.controller";
import {
  authorizedRoles,
  isAuthenticate,
} from "../../middlewares/authmiddleware";
import { Role } from "../../generated/prisma/enums";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.get(
  "/getProfile",
  isAuthenticate,
  authorizedRoles([Role.CUSTOMER, Role.PROVIDER]),
  getProfile
);

export default userRouter;
