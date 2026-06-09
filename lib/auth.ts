import { betterAuth } from "better-auth";
import db from "./db";

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000/",
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : ["http://localhost:3000"],
  emailAndPassword: { enabled: true },
});
