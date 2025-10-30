import { load } from "std/dotenv/mod.ts";

const env = await load();
export const JWT_SECRET_KEY =
  env["JWT_SECRET_KEY"] || Deno.env.get("JWT_SECRET_KEY");

if (!JWT_SECRET_KEY) {
  console.error(
    "FATALER FEHLER: Der JWT_SECRET_KEY wurde nicht in der .env-Datei definiert."
  );
  Deno.exit(1);
}

console.log("Konfiguration geladen.");
