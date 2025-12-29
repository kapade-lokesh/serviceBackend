import { Router } from "express";
import { login, getAccessToken, google } from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/refresh", getAccessToken);
authRouter.get("/google", google);

export default authRouter;
