import { Application, Router, type Context } from "oak";
import { loginHandler, jwtMiddleware } from "./auth.ts";
import { getRecipesByUser } from "./recipe.ts";

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

// GET /api/recipes
const getRecipesHandler = async (ctx: Context) => {
  try {
    const userId = ctx.state.user?.userId;

    if (!userId || typeof userId !== 'string') {
       console.error("Fehler: userId nicht im Context State gefunden nach jwtMiddleware.");
       ctx.response.status = 500; 
       ctx.response.body = { message: "Benutzerinformationen konnten nicht ermittelt werden." };
       return;
    }

    const recipes = await getRecipesByUser(userId);

    ctx.response.body = recipes;
    ctx.response.status = 200; 
  } catch (error) {
      console.error("Fehler im getRecipesHandler:", error);
      ctx.response.status = 500;
      ctx.response.body = { message: "Fehler beim Abrufen der Rezepte: " + err.message };
  }
};

router.get("/api/recipes", jwtMiddleware, getRecipesHandler);


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