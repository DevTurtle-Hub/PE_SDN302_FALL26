import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI (migrations, db push) kết nối trực tiếp qua DIRECT_URL (bỏ qua pooler transaction-mode)
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
