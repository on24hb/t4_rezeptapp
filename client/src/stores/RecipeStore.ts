import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './AuthStore.ts'
import type { Recipe } from '../types/Recipe.ts'

export const useRecipeStore = defineStore('recipes', () => {
  // --- State ---
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- Actions ---

  /**
   * Ruft die Rezepte des eingeloggten Benutzers vom Backend ab.
   * Benötigt ein gültiges Token aus dem AuthStore.
   */
  async function fetchRecipes() {
    const authStore = useAuthStore()

    if (!authStore.isLoggedIn || !authStore.token) {
      error.value = 'Nicht eingeloggt.'
      recipes.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:8000/api/recipes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Sitzung abgelaufen, bitte neu einloggen.'
          authStore.logout()
          recipes.value = []
        } else {
          const errorData = await response.json().catch(() => ({}))
          error.value = errorData.message || `Fehler beim Abrufen der Rezepte (${response.status})`
          recipes.value = []
        }
        isLoading.value = false
        return
      }

      const data = await response.json()
      recipes.value = data as Recipe[]
      console.log('Rezepte erfolgreich geladen:', recipes.value)

    } catch (err) {
      console.error('Netzwerkfehler beim Abrufen der Rezepte:', err)
      error.value = 'Netzwerkfehler oder Server nicht erreichbar.'
      recipes.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sendet ein neues Rezept an das Backend und fügt es zur lokalen Liste hinzu.
   * @param recipeData
   * @returns
   */
  async function addRecipe(recipeData: Omit<Recipe, 'id' | 'userId'>): Promise<boolean> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.token) {
      error.value = 'Nicht eingeloggt. Rezept kann nicht gespeichert werden.'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:8000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(recipeData)
      })

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Sitzung abgelaufen, bitte neu einloggen.'
          authStore.logout()
        } else {
          const errorData = await response.json().catch(() => ({}))
          error.value = errorData.message || `Fehler beim Speichern (${response.status})`
        }
        isLoading.value = false
        return false
      }

      const newRecipe = await response.json() as Recipe
      recipes.value.unshift(newRecipe)
      console.log('Rezept erfolgreich gespeichert:', newRecipe)
      return true

    } catch (err) {
      console.error('Netzwerkfehler beim Speichern des Rezepts:', err)
      error.value = 'Netzwerkfehler oder Server nicht erreichbar.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // --- Return ---
  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    addRecipe
  }
})
