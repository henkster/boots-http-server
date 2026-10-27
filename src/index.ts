import express from "express";
import { handlerReadiness } from "./api/handlerReadiness.js";
import { handlerHitWriter } from "./api/handlerHitWriter.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareHitIncrementer } from "./middleware/hitIncrementer.js";
import { handlerHitResetter } from "./api/handlerHitResetter.js";
import { handlerChirpValidator } from "./api/chirps.js";
import { errorHandler } from "./middleware/errors.js";

import { config } from "./config.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

const app = express();
const PORT = 8080;

const migrationClient = postgres(config.db.url, {max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareHitIncrementer, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHitWriter);
app.post("/admin/reset", handlerHitResetter);
app.post("/api/validate_chirp", handlerChirpValidator);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
