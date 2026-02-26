// ============================================================================
// Environment loader — must be imported BEFORE any module that reads process.env
// ============================================================================
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// In development, load from root .env (../../.env relative to live/src/)
// In production (Railway), env vars are injected by the platform
const envPath = resolve(__dirname, "../../.env");
const result = config({ path: envPath });

if (result.parsed) {
  console.log(`✅ Loaded .env from ${envPath}`);
} else {
  console.log("ℹ️  No .env file loaded (using platform env vars)");
}
