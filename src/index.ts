import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerHitWriter } from "./api/hitWriter.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareHitIncrementer } from "./middleware/hitIncrementer.js";
import { handlerResetter } from "./api/resetter.js";
import { handlerCreateChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
import { errorHandler } from "./middleware/errors.js";
import { handlerCreateUser } from "./api/users.js";

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
app.post("/api/users", handlerCreateUser);
app.get("/api/chirps/:id", handlerGetChirp);
app.get("/api/chirps", handlerGetAllChirps);
app.post("/api/chirps", handlerCreateChirp);
app.post("/admin/reset", handlerResetter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
