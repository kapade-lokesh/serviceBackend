import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";

const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/auth", authRouter);

export default appRouter;
