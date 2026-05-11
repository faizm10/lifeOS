import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const dbPath = process.env.NODE_ENV === "production" ? "/data/auth.db" : "auth.db";

export const auth = betterAuth({
  database: new Database(dbPath),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000/",
  emailAndPassword: { enabled: true },
});
