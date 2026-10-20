import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerHitWriter } from "./api/handlerHitWriter.js";
import { handlerHitWriter as handlerAdminHitWriter } from "./api/handlerHitWriter.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareHitIncrementer } from "./middleware/hitIncrementer.js";
import { handlerHitResetter } from "./api/handlerHitResetter.js";
import { handlerChirpValidator } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareHitIncrementer, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerAdminHitWriter);
app.post("/admin/reset", handlerHitResetter);
app.post("/api/validate_chirp", handlerChirpValidator);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
