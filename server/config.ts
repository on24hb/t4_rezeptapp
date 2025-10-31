import { load } from "std/dotenv/mod.ts";

const env = await load();
export const JWT_SECRET_KEY =
  env["JWT_SECRET_KEY"] || Deno.env.get("JWT_SECRET_KEY");

// --- Test-Benutzer 1 laden ---
export const TEST_USER_1_NAME =
  env["TEST_USER_1_NAME"] || Deno.env.get("TEST_USER_1_NAME");
export const TEST_USER_1_PASS =
  env["TEST_USER_1_PASS"] || Deno.env.get("TEST_USER_1_PASS");

// --- Test-Benutzer 2 laden ---
export const TEST_USER_2_NAME =
  env["TEST_USER_2_NAME"] || Deno.env.get("TEST_USER_2_NAME");
export const TEST_USER_2_PASS =
  env["TEST_USER_2_PASS"] || Deno.env.get("TEST_USER_2_PASS");

if (!JWT_SECRET_KEY) {
  console.error(
    "FATALER FEHLER: Der JWT_SECRET_KEY wurde nicht in der .env-Datei definiert."
  );
  Deno.exit(1);
}

if (
  !TEST_USER_1_NAME ||
  !TEST_USER_1_PASS ||
  !TEST_USER_2_NAME ||
  !TEST_USER_2_PASS
) {
  console.error(
    "FATALER FEHLER: Einer der Test-Benutzer (USER_1 oder USER_2) ist in .env nicht vollständig definiert."
  );
  Deno.exit(1);
}

console.log("Konfiguration geladen.");
