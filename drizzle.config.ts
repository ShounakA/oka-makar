/**
 * This file is used by the drizzle cli to generate migrations.
 * It should only be used by the drizzle cli.
 * Not for use during NEXT JS Deployments.
 */
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local"});
 
const CONNECTION_URL = process.env.DB_CONNECTION_URL;
if (!CONNECTION_URL) throw new Error('DB_CONNECTION_URL is not set');
const AUTH_TOKEN = process.env.DB_AUTH_TOKEN;
if(!AUTH_TOKEN) throw new Error('DB_AUTH_TOKEN is not set');

export default {
  schema: "./drizzle/schema.ts",
  driver: 'turso',
  dbCredentials: {
    url: CONNECTION_URL,
    authToken: AUTH_TOKEN
  },
  out: "./drizzle/migrations",
} satisfies Config;