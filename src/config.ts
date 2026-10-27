import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
  port: number;
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
  dbURL: envOrThrow("DB_URL"),
  port: Number(envOrThrow("PORT")),
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