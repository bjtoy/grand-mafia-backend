import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./schema.prisma",
  migrate: {
    connectionString: process.env.DATABASE_URL,
  },
});
