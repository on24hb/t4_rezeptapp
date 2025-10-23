import { Application, Router, type Context } from "oak";
import { loginHandler, jwtMiddleware } from "./auth.ts";
import { getRecipesByUser, createRecipe, type Recipe } from "./recipe.ts";

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


// POST /api/recipes
const createRecipeHandler = async (ctx: Context) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId || typeof userId !== 'string') {
      ctx.response.status = 500;
      ctx.response.body = { message: "Benutzerinformationen konnten nicht ermittelt werden." };
      return;
    }

    if (!ctx.request.hasBody || ctx.request.headers.get("content-type")?.toLowerCase() !== "application/json") {
      ctx.response.status = 400;
      ctx.response.body = { message: "Anfrage muss einen JSON Body mit title, ingredients und instructions enthalten." };
      return;
    }

    const body = await ctx.request.body().value;
    if (
      !body ||
      typeof body.title !== 'string' || body.title.trim() === '' ||
      !Array.isArray(body.ingredients) || body.ingredients.some((i: unknown) => typeof i !== 'string') || // Prüft, ob ingredients ein Array aus Strings ist
      typeof body.instructions !== 'string' || body.instructions.trim() === ''
    ) {
      ctx.response.status = 400; 
      ctx.response.body = { message: "Ungültige oder fehlende Daten. Benötigt: title (string), ingredients (string[]), instructions (string)." };
      return;
    }

    const recipeData: Omit<Recipe, "id" | "userId"> = {
      title: body.title.trim(),
      ingredients: body.ingredients.map((i: string) => i.trim()).filter(Boolean), // Leere Strings entfernen
      instructions: body.instructions.trim(),
    };

    const newRecipe = await createRecipe(userId, recipeData);

    ctx.response.body = newRecipe;
    ctx.response.status = 201;
    console.log(`Neues Rezept '${newRecipe.title}' für Benutzer '${userId}' erstellt.`);

  } catch (err) {
    console.error("Fehler im createRecipeHandler:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Fehler beim Erstellen des Rezepts: " + err.message };
  }
};

router.post("/api/recipes", jwtMiddleware, createRecipeHandler);


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