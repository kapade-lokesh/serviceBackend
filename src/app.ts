import express, { type Express } from "express";
import cors from "cors";
import appRouter from "./routes";
import { errorHandler } from "./utils/errorhandler";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", appRouter);
app.get("/", (req, res) => {
  res.send("server is running");
});

app.use(errorHandler);

export default app;
