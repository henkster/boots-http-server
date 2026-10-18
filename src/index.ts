import express from "express";
import { handlerReadiness } from "./handlerReadiness.js";
import { handlerHitWriter } from "./handlerHitWriter.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareHitIncrementer } from "./middleware/hitIncrementer.js";
import { handlerHitResetter } from "./handlerHitResetter.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", middlewareHitIncrementer, express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerHitWriter);
app.get("/reset", handlerHitResetter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
