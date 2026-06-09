import fs from "fs";
import path from "path";

export function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  if (fs.existsSync("/data")) {
    return "/data/auth.db";
  }
  return path.join(process.cwd(), "auth.db");
}

export function ensureDatabaseDirectory(dbPath: string): void {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
