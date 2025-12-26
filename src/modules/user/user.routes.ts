import { Router } from "express";
import { getProfile, registerUserController } from "./user.controller";
import { isAuthenticate } from "../../middlewares/authmiddleware";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.get("/getProfile", isAuthenticate, getProfile);

export default userRouter;
