import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './AuthStore.ts'
import type { Recipe } from '../types/Recipe.ts'

export const useRecipeStore = defineStore('recipes', () => {
  // --- State ---
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeTagFilters = ref<string[]>([])

  // --- Getters ---
  /**
   * Ein Getter, der die Rezeptliste basierend auf den aktiven Filtern berechnet
   */
  const filteredRecipes = computed(() => {
    if (activeTagFilters.value.length === 0) {
      return recipes.value
    }
    // Wenn Filter aktiv sind, filtere die Liste
    return recipes.value.filter(recipe => {
      // Prüfe, ob das Rezept überhaupt Tags hat
      if (!recipe.tags || recipe.tags.length === 0) {
        return false
      }
      return activeTagFilters.value.every(filterTag =>
        recipe.tags?.includes(filterTag)
      )
    })
  })

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

  /**
     * Sendet eine Löschanfrage an das Backend und entfernt das Rezept aus der lokalen Liste
     * @param recipeId
     * @returns
     */
    async function deleteRecipeAction(recipeId: string): Promise<boolean> {
      const authStore = useAuthStore() // Zugriff auf den AuthStore
      if (!authStore.isLoggedIn || !authStore.token) {
        error.value = 'Nicht eingeloggt. Rezept kann nicht gelöscht werden.'
        return false
      }

      isLoading.value = true;
      error.value = null

      try {
        const response = await fetch(`https://localhost:8000/api/recipes/${recipeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            error.value = 'Sitzung abgelaufen, bitte neu einloggen.'
            authStore.logout()
          } else if (response.status === 404) {
            error.value = 'Rezept nicht gefunden oder bereits gelöscht.'
            // Vorsorglich lokal entfernen
            recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
          } else {
            const errorData = await response.json().catch(() => ({}))
            error.value = errorData.message || `Fehler beim Löschen (${response.status})`
          }
          return false
        }

        recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId) // Rezept aus lokaler Liste entfernen
        console.log(`Rezept ${recipeId} lokal entfernt.`)
        return true

      } catch (err) {
        console.error('Netzwerkfehler beim Löschen des Rezepts:', err)
        error.value = 'Netzwerkfehler oder Server nicht erreichbar.'
        return false
      } finally {
        isLoading.value = false;
      }
    }

    /**
   * Sendet eine Update-Anfrage an das Backend und aktualisiert das Rezept in der lokalen Liste
   * @param recipeId
   * @param recipeData
   * @returns
   */
  async function updateRecipeAction(recipeId: string, recipeData: Omit<Recipe, 'id' | 'userId'>): Promise<boolean> {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn || !authStore.token) {
      error.value = 'Nicht eingeloggt. Rezept kann nicht aktualisiert werden.'
      return false
    }

    isLoading.value = true;
    error.value = null

    try {
      const response = await fetch(`https://localhost:8000/api/recipes/${recipeId}`, {
        method: 'PUT',
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
        } else if (response.status === 404) {
           error.value = 'Rezept nicht gefunden.'
            // Vorsorglich lokal entfernen
        } else {
          const errorData = await response.json().catch(() => ({}))
          error.value = errorData.message || `Fehler beim Aktualisieren (${response.status})`
        }
        isLoading.value = false;
        return false
      }

      const updatedRecipe = await response.json() as Recipe
      const index = recipes.value.findIndex(r => r.id === recipeId)
      if (index !== -1) {
        recipes.value[index] = updatedRecipe
      } else {
        recipes.value.unshift(updatedRecipe);
      }
      console.log('Rezept erfolgreich aktualisiert:', updatedRecipe)
      return true

    } catch (err) {
      console.error('Netzwerkfehler beim Aktualisieren des Rezepts:', err)
      error.value = 'Netzwerkfehler oder Server nicht erreichbar.'
      return false
    } finally {
      isLoading.value = false;
    }
  }

  /**
     * Fügt einen Tag-Filter hinzu, WENN er noch nicht aktiv ist.
     * @param tagName
     */
    function addTagFilter(tagName: string) {
      if (tagName && !activeTagFilters.value.includes(tagName)) {
        activeTagFilters.value.push(tagName);
      }
      console.log('Aktive Filter:', activeTagFilters.value);
    }

  /**
     * Entfernt einen spezifischen Tag-Filter.
     * @param tagName
     */
    function removeTagFilter(tagName: string) {
      activeTagFilters.value = activeTagFilters.value.filter(t => t !== tagName);
      console.log('Aktive Filter:', activeTagFilters.value);
    }

  // Setzt alle aktiven Tag-Filter zurück.
    function clearTagFilters() {
      activeTagFilters.value = []
      console.log('Filter zurückgesetzt');
    }

  // --- Return ---
  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    addRecipe,
    deleteRecipeAction,
    updateRecipeAction,
    activeTagFilters,
    filteredRecipes,
    addTagFilter,
    removeTagFilter,
    clearTagFilters
  }
})
