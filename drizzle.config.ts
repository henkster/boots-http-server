import { defineConfig } from "drizzle-kit";
import { config } from "./src/config"

export default defineConfig({
  schema: "src/db/schema.ts",
  out: config.db.migrationConfig.migrationsFolder,
  dialect: "postgresql",
  dbCredentials: {
    url: config.db.url
  }
});
