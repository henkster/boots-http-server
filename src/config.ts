import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
};

type DbConfig = {
  url: string,
  migrationConfig: MigrationConfig,
}

type Config = {
  api: APIConfig,
  db: DbConfig,
}

process.loadEnvFile();

function envOrThrow(key: string) {
  const val = process.env[key];

  if (val === undefined) {
    throw new Error(`Env variable ${key} not found`);
  }

  return val;
}

const apiConfig: APIConfig = {
  fileserverHits: 0,
  port: Number(envOrThrow("PORT")),
  platform: envOrThrow("PLATFORM"),
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "src/db/migrations",
}

const dbConfig: DbConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig
}

export const config: Config = {
  api: apiConfig,
  db: dbConfig,
}