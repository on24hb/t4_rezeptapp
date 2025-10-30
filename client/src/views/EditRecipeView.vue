<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecipeStore } from '../stores/RecipeStore'
import RecipeForm from '../components/RecipeForm.vue'
import type { Recipe } from '../types/Recipe'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
}>()

const recipeStore = useRecipeStore()
const router = useRouter()

const recipeToEdit = ref<Recipe | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Finde das Rezept im Store, sobald die Komponente geladen wird
onMounted(async () => {
  if (recipeStore.recipes.length === 0) {
    await recipeStore.fetchRecipes()
  }

  const foundRecipe = recipeStore.recipes.find((r) => r.id === props.id)
  if (foundRecipe) {
    recipeToEdit.value = { ...foundRecipe } // Kopie erstellen, um Reaktivitätsprobleme zu vermeiden
  } else {
    error.value = `Rezept mit ID ${props.id} nicht gefunden.`
  }
  isLoading.value = false
})

// Funktion, die aufgerufen wird, wenn das Formular gespeichert wird
async function handleUpdate(updatedData: Omit<Recipe, 'id' | 'userId'>) {
  if (!recipeToEdit.value) return

  isLoading.value = true
  error.value = null

  const success = await recipeStore.updateRecipeAction(props.id, updatedData)

  if (success) {
    router.push({ name: 'recipe-detail' })
  } else {
    error.value = recipeStore.error || 'Rezept konnte nicht aktualisiert werden.'
  }
}
</script>

<template>
  <div class="edit-recipe-view">
    <h2>Rezept bearbeiten</h2>

    <p v-if="isLoading">Lade Rezeptdaten...</p>
    <p v-else-if="error" style="color: red">Fehler: {{ error }}</p>

    <RecipeForm
      v-else-if="recipeToEdit"
      :initialData="recipeToEdit"
      :is-loading-externally="isLoading"
      @submit-recipe="handleUpdate"
      submit-button-text="Änderungen speichern"
    />

    <router-link :to="{ name: 'recipe-detail' }">Abbrechen</router-link>
  </div>
</template>

<style scoped>
.edit-recipe-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  box-shadow: var(--box-shadow);
}

.edit-recipe-view > a {
  display: block;
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
}
.edit-recipe-view > a:hover {
  text-decoration: underline;
}
</style>
