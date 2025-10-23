import { Application, Router } from "oak";

const app = new Application();
const router = new Router();

// Test-Route
router.get("/", (ctx) => {
  ctx.response.body = "Hallo Rezept-App!";
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server wird gestartet...");

await app.listen({ port: 8000 });

console.log("Server läuft auf http://localhost:8000");