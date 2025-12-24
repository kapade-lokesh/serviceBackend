import app from "./src/app";
import "dotenv/config";
import { test } from "./src/test";

const PORT = process.env.PORT;

test();

app.listen(PORT, () => {
  console.log("server is running on port 8000");
});
