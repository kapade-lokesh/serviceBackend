import { Router } from "express";
import { login, getAccessToken } from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/refresh", getAccessToken);

export default authRouter;
