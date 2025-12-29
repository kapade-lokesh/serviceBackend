import express, { type Express } from "express";
import cors from "cors";
import appRouter from "./routes";
import { errorHandler } from "./utils/errorhandler";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/api", appRouter);
app.get("/", (req, res) => {
  res.send("server is running");
});

app.use(errorHandler);

export default app;
