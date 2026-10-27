process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow("DB_URL"),
};

function envOrThrow(key: string): string {
  const val = process.env[key];

  if (val === undefined) {
    throw new Error(`Env variable ${key} not found`);
  }

  return val;
}