import { Application, Router } from "oak";

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

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server wird gestartet...");

console.log("Server läuft auf https://localhost:8000"); 
await app.listen({
  port: 8000,
  cert: await Deno.readTextFile("./localhost.pem"),
  key: await Deno.readTextFile("./localhost-key.pem"),
});