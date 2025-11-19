// server/seed.ts
import { createRecipe, getRecipesByUser } from "./recipe.ts";
import { TEST_USER_1_NAME } from "./config.ts";

export async function seedDatabase() {
  const userId = TEST_USER_1_NAME;

  if (!userId) {
    console.warn("Kein Test-User in Config gefunden. Überspringe Seeding.");
    return;
  }

  // Prüfen, ob schon Rezepte da sind
  const existingRecipes = await getRecipesByUser(userId);

  if (existingRecipes.length > 0) {
    console.log("Datenbank enthält bereits Daten. Überspringe Seeding.");
    return;
  }

  console.log(`Datenbank leer. Erstelle Beispieldaten für '${userId}'...`);

  // Beispielrezepte anlegen
  await createRecipe(userId, {
    title: "Spaghetti Aglio e Olio",
    ingredients: [
      "500g Spaghetti",
      "6 Zehen Knoblauch",
      "100ml Olivenöl",
      "1 Chilischote",
      "Frische Petersilie",
    ],
    instructions:
      "Spaghetti in Salzwasser al dente kochen. Währenddessen Knoblauch in dünne Scheiben schneiden. Olivenöl in einer Pfanne erhitzen, Knoblauch und Chili darin goldbraun anbraten. Nudeln abgießen (etwas Kochwasser auffangen) und in die Pfanne geben. Alles vermengen und mit Petersilie bestreuen.",
    tags: ["schnell", "vegan", "herzhaft"],
  });

  await createRecipe(userId, {
    title: "Omas Fluffige Pfannkuchen",
    ingredients: [
      "200g Mehl",
      "4 Eier",
      "300ml Milch",
      "1 Prise Salz",
      "Mineralwasser (spritzig)",
      "Butter zum Braten",
    ],
    instructions:
      "Mehl, Eier, Milch und Salz zu einem glatten Teig verrühren. Einen Schuss Mineralwasser für die Fluffigkeit dazu. In einer Pfanne etwas Butter erhitzen. Mit einer Kelle Teig hineingeben und nacheinander goldbraune Pfannkuchen ausbacken. Nach Belieben mit Zimt & Zucker oder Nutella servieren.",
    tags: ["süß", "vegetarisch"],
  });

  await createRecipe(userId, {
    title: "Pizza Margherita (Selfmade)",
    ingredients: [
      "500g Pizzateig (oder Mehl/Hefe/Wasser)",
      "200ml Tomatensauce",
      "250g Mozzarella",
      "Frisches Basilikum",
      "Olivenöl",
    ],
    instructions:
      "Den Ofen auf 250°C (Ober-/Unterhitze) vorheizen. Teig ausrollen und auf ein Blech legen. Tomatensauce gleichmäßig verteilen. Mozzarella in Stücke zupfen und darauflegen. Für 10-12 Minuten backen, bis der Rand knusprig braun ist. Nach dem Backen mit frischem Basilikum und einem Schuss Olivenöl garnieren.",
    tags: ["herzhaft", "vegetarisch"],
  });

  await createRecipe(userId, {
    title: "Griechischer Bauernsalat",
    ingredients: [
      "3 große Tomaten",
      "1 Salatgurke",
      "1 Rote Zwiebel",
      "200g Feta-Käse",
      "Eine Handvoll schwarze Oliven",
      "Oregano, Olivenöl, Weinessig",
    ],
    instructions:
      "Gemüse waschen und grob würfeln. Zwiebel in feine Ringe schneiden. Alles in eine große Schüssel geben. Feta als ganzen Block darauflegen oder würfeln. Oliven hinzufügen. Großzügig mit Olivenöl und etwas Essig beträufeln und mit Oregano bestreuen. Dazu passt Weißbrot.",
    tags: ["schnell", "vegetarisch", "herzhaft"],
  });

  await createRecipe(userId, {
    title: "Double Choc Brownies",
    ingredients: [
      "200g Zartbitterschokolade",
      "150g Butter",
      "3 Eier",
      "150g Zucker",
      "100g Mehl",
      "Eine Handvoll Walnüsse (optional)",
    ],
    instructions:
      "Schokolade und Butter im Wasserbad schmelzen. Eier und Zucker schaumig schlagen, dann die Schokomasse unterrühren. Mehl und grob gehackte Nüsse unterheben. In eine gefettete Form füllen und bei 180°C ca. 20-25 Min backen. Wichtig: Sie sollen innen noch leicht klitschig (fudgy) sein!",
    tags: ["süß", "schnell", "vegetarisch"],
  });

  await createRecipe(userId, {
    title: "Green Power Smoothie",
    ingredients: [
      "1 Banane",
      "2 Handvoll Spinat (frisch)",
      "1 Apfel",
      "200ml Wasser oder Hafermilch",
      "Ein Spritzer Zitronensaft",
    ],
    instructions:
      "Alle Zutaten waschen bzw. schälen und grob zerkleinern. In einen Standmixer geben und auf höchster Stufe mixen, bis keine Stückchen mehr zu sehen sind. Sofort servieren für die meisten Vitamine.",
    tags: ["getränk", "vegan", "schnell", "süß"],
  });

  await createRecipe(userId, {
    title: "Chili con Carne (Klassisch)",
    ingredients: [
      "500g Rinderhackfleisch",
      "1 Dose Kidneybohnen",
      "1 Dose Mais",
      "1 Dose gehackte Tomaten",
      "2 Zwiebeln",
      "Knoblauch, Chili, Kreuzkümmel",
    ],
    instructions:
      "Zwiebeln und Knoblauch hacken und anbraten. Hackfleisch dazu und krümelig braten. Tomatenmark kurz mitrösten. Mit gehackten Tomaten ablöschen. Gewürze hinzufügen und 20 Min köcheln lassen. Bohnen und Mais erst kurz vor Schluss dazu geben, damit sie nicht zerkochen. Dazu passt Reis oder Baguette.",
    tags: ["herzhaft"],
  });

  await createRecipe(userId, {
    title: "Selbstgemachte Zitronenlimonade",
    ingredients: [
      "4 Bio-Zitronen",
      "100g Zucker (oder Honig)",
      "1 Liter Mineralwasser",
      "Eiswürfel",
      "Frische Minze",
    ],
    instructions:
      "Zitronen auspressen. Den Saft mit dem Zucker verrühren, bis er sich aufgelöst hat (evtl. leicht erwärmen). Mit kaltem Mineralwasser aufgießen. Eiswürfel und Minzezweige dazu geben. Kalt genießen!",
    tags: ["getränk", "schnell", "vegan", "süß"],
  });

  console.log("Seed abgeschlossen! 8 Rezepte angelegt.");
}
