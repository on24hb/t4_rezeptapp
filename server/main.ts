import { Application, Router } from "oak";
import { loginHandler } from "./auth.ts";

const app = new Application();
const router = new Router();

// Logging Middleware 
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
});

// Test-Route
router.get("/", (ctx) => {
  ctx.response.body = "Hallo Rezept-App!";
});

// Login-Route für POST-Anfragen
router.post("/login", loginHandler);

// App Start
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server wird gestartet...");

console.log("Server läuft auf https://localhost:8000"); 
await app.listen({
  port: 8000,
  cert: await Deno.readTextFile("./localhost.pem"),
  key: await Deno.readTextFile("./localhost-key.pem"),
});