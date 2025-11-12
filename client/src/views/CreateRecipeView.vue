<script setup lang="ts">
import RecipeForm from '@/components/RecipeForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '@/types/Recipe'
import { useRecipeStore } from '@/stores/RecipeStore'

const recipeStore = useRecipeStore()
const router = useRouter()
const isLoading = ref(false)
const error = ref<string | null>(null)

// Funktion, die auf das Event vom Formular reagiert
async function handleCreate(recipeData: Omit<Recipe, 'id' | 'userId' | 'isFavorite'>) {
  isLoading.value = true
  error.value = null

  const success = await recipeStore.addRecipe({ ...recipeData, isFavorite: false })
  isLoading.value = false

  if (success) {
    router.push({ name: 'home' })
  } else {
    error.value = recipeStore.error || 'Rezept konnte nicht erstellt werden.'
  }
}
</script>

<template>
  <div class="create-recipe-view">
    <h2>Neues Rezept erstellen</h2>
    <RecipeForm
      :is-loading-externally="isLoading"
      @submit-recipe="handleCreate"
      submit-button-text="Rezept erstellen"
    />
    <p v-if="error" style="color: red; text-align: center; margin-top: 1rem">{{ error }}</p>
    <router-link :to="{ name: 'home' }">Zurück zur Übersicht</router-link>
  </div>
</template>

<style scoped>
.create-recipe-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  box-shadow: var(--box-shadow);
}
h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  color: var(--primary-color);
}
a {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-light);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
