import { Router } from "express";
import userRouter from "../modules/user/user.routes";

const appRouter = Router();

appRouter.use("/users", userRouter);

export default appRouter;
