import { Router } from "express";
import { registerUserController } from "./userController";

const userRouter = Router();

userRouter.post("/register", registerUserController);

export default userRouter;
