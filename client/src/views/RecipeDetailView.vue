<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRecipeStore } from '@/stores/RecipeStore';
import type { Recipe } from '@/types/Recipe';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  id: string;
}>();

const recipeStore = useRecipeStore();
const route = useRoute();
const router = useRouter();

const recipe = ref<Recipe | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Funktion zum Laden/Finden des Rezepts
async function loadRecipe() {
    isLoading.value = true;
    error.value = null;
    try {
        if (recipeStore.recipes.length === 0 && !recipeStore.isLoading && !recipeStore.error) {
            await recipeStore.fetchRecipes();
        }
        const foundRecipe = recipeStore.recipes.find(r => r.id === props.id);
        if (foundRecipe) {
            recipe.value = foundRecipe;
        } else {
            error.value = `Rezept mit ID ${props.id} nicht gefunden.`;
        }
   } catch (err) {
        console.error("Fehler beim Laden:", err);
        error.value = recipeStore.error || 'Fehler beim Laden des Rezepts.';
      } finally {
        isLoading.value = false;
    }
}

onMounted(loadRecipe);

// Beobachte ID-Änderung
watch(() => route.params.id, (newId) => {
    if (newId && typeof newId === 'string' && newId !== recipe.value?.id) {
        loadRecipe();
    }
});

 // Funktion zum Löschen eines Rezepts
 async function handleDelete(recipeId: string, recipeTitle: string) {
   if (confirm(`Möchtest du das Rezept "${recipeTitle}" wirklich löschen?`)) {
     console.log('Lösche Rezept:', recipeId);
     const success = await recipeStore.deleteRecipeAction(recipeId);
     if (success) {
       console.log('Rezept erfolgreich gelöscht.');
     } else {
       alert(`Fehler beim Löschen: ${recipeStore.error || 'Unbekannter Fehler'}`);
     }
   }
 }

 // Funktion zum Bearbeiten eines Rezepts
 function startEdit(recipeId: string) {
   console.log('Navigiere zum Bearbeiten von Rezept:', recipeId);
   router.push({ name: 'edit-recipe', params: { id: recipeId } });
 }

</script>

<template>
  <div class="recipe-detail-view">
    <router-link :to="{ name: 'home' }" class="btn-back">&larr; Zurück</router-link>
    <div v-if="isLoading">Lade Rezept...</div>
    <div v-else-if="error" style="color: red;">Fehler: {{ error }}</div>

    <article v-else-if="recipe">
      <h2>{{ recipe.title }}</h2>

      <section class="details-section">
        <h3>Zutaten</h3>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </section>

      <section class="details-section">
        <h3>Anleitung</h3>
        <p style="white-space: pre-wrap;">{{ recipe.instructions }}</p>
      </section>

      <div class="actions-footer">
        <button @click.stop="startEdit(recipe.id)" class="btn-edit">
          Bearbeiten
        </button>
        <button @click.stop="handleDelete(recipe.id, recipe.title)" class="btn-delete">
          Löschen
        </button>
      </div>

    </article>

    <div v-else>Rezept nicht gefunden.</div>
  </div>
</template>

<style scoped>
.recipe-detail-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}
.btn-back:hover {
  text-decoration: underline;
}

h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.details-section {
  margin-bottom: 2rem;
}

.details-section h3 {
  color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.details-section ul {
  list-style: none;
  padding-left: 0;
}

.details-section li {
  margin-bottom: 0.5rem;
  color: var(--text-light);
  position: relative;
  padding-left: 1.5em;
}
 .details-section li::before {
    content: '•';
    color: var(--primary-color);
    position: absolute;
    left: 0;
    top: 0;
}

.details-section p {
  line-height: 1.7;
  color: var(--text-color);
}

.actions-footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
}

.actions-footer button {
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}
.btn-edit:hover {
  background-color: var(--secondary-color);
  color: white;
}

.btn-delete {
  background-color: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}
.btn-delete:hover {
  background-color: var(--danger-color);
  color: white;
}
</style>
