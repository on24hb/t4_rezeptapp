import { Application, Router, type RouterContext, send } from "oak";
import { loginHandler, jwtMiddleware } from "./auth.ts";
import {
  getRecipesByUser,
  createRecipe,
  type Recipe,
  updateRecipe,
  deleteRecipe,
  toggleFavoriteStatus,
} from "./recipe.ts";
import { type JWTPayload } from "jose";

interface AppState {
  user?: JWTPayload & { userId: string };
}

const app = new Application<AppState>();
const router = new Router();

// CORS Middleware
app.use(async (ctx, next) => {
  const allowedOrigins = ["https://localhost:5173", "https://127.0.0.1:5173"];
  const origin = ctx.request.headers.get("Origin");
  if (origin && allowedOrigins.includes(origin)) {
    ctx.response.headers.set("Access-Control-Allow-Origin", origin);
  }

  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  ctx.response.headers.set("Access-Control-Allow-Credentials", "true"); // Optional, falls Cookies/Credentials nötig

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
  } else {
    await next();
  }
});

// Logging Middleware
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
});

// Login-Route für POST-Anfragen
router.post("/login", loginHandler);

// GET /api/recipes
const getRecipesHandler = async (
  ctx: RouterContext<"/api/recipes", Record<string, never>, AppState>
) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId) {
      console.error(
        "Fehler: userId nicht im Context State gefunden nach jwtMiddleware."
      );
      ctx.response.status = 500;
      ctx.response.body = {
        message: "Benutzerinformationen konnten nicht ermittelt werden.",
      };
      return;
    }

    const recipes = await getRecipesByUser(userId);

    ctx.response.body = recipes;
    ctx.response.status = 200;
  } catch (err) {
    console.error("Fehler im getRecipesHandler:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Fehler beim Abrufen der Rezepte: " + errorMessage,
    };
  }
};

router.get("/api/recipes", jwtMiddleware, getRecipesHandler);

// POST /api/recipes
const createRecipeHandler = async (
  ctx: RouterContext<"/api/recipes", Record<string, never>, AppState>
) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "Benutzerinformationen konnten nicht ermittelt werden.",
      };
      return;
    }

    if (
      !ctx.request.hasBody ||
      ctx.request.headers.get("content-type")?.toLowerCase() !==
        "application/json"
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Anfrage muss einen JSON Body mit title, ingredients und instructions enthalten.",
      };
      return;
    }

    const body = await ctx.request.body().value;

    // Validierung für Tags
    const tagsFromBody = body.tags;
    let validatedTags: string[] = [];
    if (tagsFromBody !== undefined) {
      // Nur prüfen, wenn 'tags' gesendet wurde
      if (
        !Array.isArray(tagsFromBody) ||
        !tagsFromBody.every((t: unknown) => typeof t === "string")
      ) {
        ctx.response.status = 400;
        ctx.response.body = {
          message: "Ungültige Daten: 'tags' muss ein Array aus Strings sein.",
        };
        return;
      }
      validatedTags = tagsFromBody.map((t: string) => t.trim()).filter(Boolean);
    }

    // Validierung der Pflichtfelder
    if (
      !body ||
      typeof body.title !== "string" ||
      body.title.trim() === "" ||
      !Array.isArray(body.ingredients) ||
      body.ingredients.some((i: unknown) => typeof i !== "string") || // Prüft, ob ingredients ein Array aus Strings ist
      typeof body.instructions !== "string" ||
      body.instructions.trim() === ""
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Ungültige oder fehlende Daten. Benötigt: title (string), ingredients (string[]), instructions (string).",
      };
      return;
    }

    const recipeData: Omit<Recipe, "id" | "userId" | "isFavorite"> = {
      title: body.title.trim(),
      ingredients: body.ingredients
        .map((i: string) => i.trim())
        .filter(Boolean), // Leere Strings entfernen
      instructions: body.instructions.trim(),
      tags: validatedTags,
    };

    const newRecipe = await createRecipe(userId, recipeData);

    ctx.response.body = newRecipe;
    ctx.response.status = 201;
    console.log(
      `Neues Rezept '${newRecipe.title}' für Benutzer '${userId}' erstellt.`
    );
  } catch (err) {
    console.error("Fehler im createRecipeHandler:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Fehler beim Erstellen des Rezepts: " + errorMessage,
    };
  }
};

router.post("/api/recipes", jwtMiddleware, createRecipeHandler);

// PUT /api/recipes/:id
const updateRecipeHandler = async (
  ctx: RouterContext<"/api/recipes/:id", { id: string }, AppState>
) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "Benutzerinformationen konnten nicht ermittelt werden.",
      };
      return;
    }

    const recipeId = ctx.params.id;

    if (
      !ctx.request.hasBody ||
      ctx.request.headers.get("content-type")?.toLowerCase() !==
        "application/json"
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Anfrage muss einen JSON Body mit title, ingredients und instructions enthalten.",
      };
      return;
    }
    const body = await ctx.request.body().value;

    // Validierung für Tags
    const tagsFromBody = body.tags;
    let validatedTags: string[] = [];
    if (tagsFromBody !== undefined) {
      // Nur prüfen, wenn 'tags' gesendet wurde
      if (
        !Array.isArray(tagsFromBody) ||
        !tagsFromBody.every((t: unknown) => typeof t === "string")
      ) {
        ctx.response.status = 400;
        ctx.response.body = {
          message: "Ungültige Daten: 'tags' muss ein Array aus Strings sein.",
        };
        return;
      }
      validatedTags = tagsFromBody.map((t: string) => t.trim()).filter(Boolean);
    }

    // Validierung der Pflichtfelder
    if (
      !body ||
      typeof body.title !== "string" ||
      body.title.trim() === "" ||
      !Array.isArray(body.ingredients) ||
      body.ingredients.some((i: unknown) => typeof i !== "string") ||
      typeof body.instructions !== "string" ||
      body.instructions.trim() === ""
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message:
          "Ungültige oder fehlende Daten. Benötigt: title (string), ingredients (string[]), instructions (string).",
      };
      return;
    }
    const updatedData: Omit<Recipe, "id" | "userId" | "isFavorite"> = {
      title: body.title.trim(),
      ingredients: body.ingredients
        .map((i: string) => i.trim())
        .filter(Boolean),
      instructions: body.instructions.trim(),
      tags: validatedTags,
    };
    const updatedRecipe = await updateRecipe(userId, recipeId, updatedData);

    if (updatedRecipe) {
      ctx.response.body = updatedRecipe;
      ctx.response.status = 200;
      console.log(
        `Rezept '${updatedRecipe.title}' (ID: ${recipeId}) für Benutzer '${userId}' aktualisiert.`
      );
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: `Rezept mit ID '${recipeId}' nicht gefunden oder Zugriff verweigert.`,
      };
      console.warn(
        `Fehlgeschlagener Update-Versuch für Rezept ID '${recipeId}', Benutzer '${userId}'.`
      );
    }
  } catch (err) {
    console.error("Fehler im updateRecipeHandler:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Fehler beim Aktualisieren des Rezepts: " + errorMessage,
    };
  }
};

router.put("/api/recipes/:id", jwtMiddleware, updateRecipeHandler);

// DELETE /api/recipes/:id
const deleteRecipeHandler = async (
  ctx: RouterContext<"/api/recipes/:id", { id: string }, AppState>
) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "Benutzerinformationen konnten nicht ermittelt werden.",
      };
      return;
    }

    const recipeId = ctx.params.id;
    const deleted = await deleteRecipe(userId, recipeId);

    if (deleted) {
      ctx.response.status = 204;
      console.log(`Rezept ID '${recipeId}' für Benutzer '${userId}' gelöscht.`);
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: `Rezept mit ID '${recipeId}' nicht gefunden oder Zugriff verweigert.`,
      };
      console.warn(
        `Fehlgeschlagener Lösch-Versuch für Rezept ID '${recipeId}', Benutzer '${userId}'.`
      );
    }
  } catch (err) {
    console.error("Fehler im deleteRecipeHandler:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Fehler beim Löschen des Rezepts: " + errorMessage,
    };
  }
};

router.delete("/api/recipes/:id", jwtMiddleware, deleteRecipeHandler);

const favoriteRecipeHandler = async (
  ctx: RouterContext<"/api/recipes/:id/favorite", { id: string }, AppState>
) => {
  try {
    const userId = ctx.state.user?.userId;
    if (!userId) {
      return;
    }
    const recipeId = ctx.params.id;

    const updatedRecipe = await toggleFavoriteStatus(userId, recipeId);

    if (updatedRecipe) {
      ctx.response.body = updatedRecipe;
      ctx.response.status = 200;
      console.log(
        `Rezept ${recipeId} Favoriten-Status für User ${userId} umgeschaltet.`
      );
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: `Rezept mit ID '${recipeId}' nicht gefunden oder Zugriff verweigert.`,
      };
    }
  } catch (err) {
    console.error("Fehler im favoriteRecipeHandler:", err);
  }
};

router.patch("/api/recipes/:id/favorite", jwtMiddleware, favoriteRecipeHandler);

app.use(router.routes());
app.use(router.allowedMethods());

// Statische Dateien ausliefern
app.use(async (ctx, next) => {
  const path = ctx.request.url.pathname;

  // API-Calls sollen nicht hier behandelt werden
  if (path.startsWith("/api")) {
    await next();
    return;
  }

  try {
    await send(ctx, path, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    // Wenn Datei nicht gefunden, weiter zur nächsten Middleware (SPA Fallback)
    await next();
  }
});

// SPA Fallback
// Fängt alle Routen ab, die nicht gefunden wurden, und liefert index.html
app.use(async (ctx) => {
  const path = ctx.request.url.pathname;

  if (path.match(/\.(js|css|png|jpg|ico|json)$/)) {
    ctx.response.status = 404;
    ctx.response.body = "Not found";
    return;
  }

  // Ansonsten immer die index.html senden
  await send(ctx, "/", {
    root: `${Deno.cwd()}/public`,
    index: "index.html",
  });
});

// App Start
console.log("Server wird gestartet...");
console.log(`Root Verzeichnis: ${Deno.cwd()}/public`); // Zur Kontrolle beim Start

console.log("Server läuft auf https://localhost:8000");
await app.listen({
  port: 8000,
  cert: await Deno.readTextFile("./localhost.pem"),
  key: await Deno.readTextFile("./localhost-key.pem"),
});
