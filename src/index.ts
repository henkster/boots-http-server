import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerHitWriter } from "./api/handlerHitWriter.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareHitIncrementer } from "./middleware/hitIncrementer.js";
import { handlerHitResetter } from "./api/handlerHitResetter.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", middlewareHitIncrementer, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerHitWriter);
app.get("/api/reset", handlerHitResetter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
