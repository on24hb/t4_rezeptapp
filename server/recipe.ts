export interface Recipe {
  id: string; 
  userId: string; 
  title: string; 
  ingredients: string[]; 
  instructions: string; 
  // TODO: später eitere Felder wie 'category', 'duration', 'createdAt' hinzufügen
}

/**
 * Rezepte für einen bestimmten Benutzer aus Deno KV abrufen
 * @param userId 
 * @returns 
 * */
export async function getRecipesByUser(userId: string): Promise<Recipe[]> {
  const kv = await Deno.openKv(); 
  const recipes: Recipe[] = []; 

  const recipeEntries = kv.list<Recipe>({ prefix: ["recipes", userId] });

  for await (const entry of recipeEntries) {
    recipes.push(entry.value);
  }

  return recipes;
}

/**
 * Neues Rezept erstellen und in Deno KV speichern
 * @param userId 
 * @param recipeData 
 * @returns 
 */
export async function createRecipe(
  userId: string,
  recipeData: Omit<Recipe, "id" | "userId">,
): Promise<Recipe> {
  const kv = await Deno.openKv();

  const newRecipeId = crypto.randomUUID();

  const newRecipe: Recipe = {
    id: newRecipeId,
    userId: userId,
    title: recipeData.title,
    ingredients: recipeData.ingredients,
    instructions: recipeData.instructions,
  };

  const recipeKey = ["recipes", userId, newRecipeId];

  await kv.set(recipeKey, newRecipe);

  return newRecipe;
}