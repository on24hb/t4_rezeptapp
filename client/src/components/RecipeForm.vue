<script setup lang="ts">
import { ref } from 'vue'
import { useRecipeStore } from '../stores/RecipeStore'
import { useRouter } from 'vue-router'
import type { Recipe } from '../types/Recipe'

const recipeStore = useRecipeStore()
const router = useRouter()

const title = ref('')
const ingredientsText = ref('')
const instructions = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

function parseIngredients(text: string): string[] {
  // Teilt den Text an Zeilenumbrüchen, entfernt leere Zeilen und Leerzeichen am Anfang/Ende
  return text.split('\n').map(line => line.trim()).filter(Boolean)
}

async function handleSubmit() {
  isLoading.value = true
  error.value = null

  const ingredientsArray = parseIngredients(ingredientsText.value)

  // Einfache Validierung
  if (!title.value || ingredientsArray.length === 0 || !instructions.value) {
    error.value = 'Bitte fülle alle Felder aus.'
    isLoading.value = false
    return
  }

  // Datenobjekt für das neue Rezept
  const recipeData: Omit<Recipe, 'id' | 'userId'> = {
    title: title.value,
    ingredients: ingredientsArray,
    instructions: instructions.value
  }

  const success = await recipeStore.addRecipe(recipeData)
  isLoading.value = false

  if (success) {
    router.push({ name: 'home' })
  } else {
    error.value = recipeStore.error || 'Rezept konnte nicht gespeichert werden.'
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Titel:</label>
      <input type="text" id="title" v-model="title" required :disabled="isLoading" />
    </div>

    <div class="form-group">
      <label for="ingredients">Zutaten (pro Zeile eine Zutat):</label>
      <textarea id="ingredients" v-model="ingredientsText" rows="5" required :disabled="isLoading"></textarea>
    </div>

    <div class="form-group">
      <label for="instructions">Anleitung:</label>
      <textarea id="instructions" v-model="instructions" rows="8" required :disabled="isLoading"></textarea>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>

    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Speichern...' : 'Rezept speichern' }}
    </button>
  </form>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-light);
}
input[type="text"],
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  font-family: inherit;
  background-color: var(--background-color);
  color: var(--text-color);
}
textarea {
    resize: vertical;
}
button {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  opacity: 0.9;
}
.error-message {
  color: var(--danger-color);
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
</style>
