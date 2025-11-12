<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useRecipeStore } from '../stores/RecipeStore'
import RecipeTags from '../components/RecipeTags.vue'
import { availableTags, getTagColorClassByName } from '../config/tags'

const authStore = useAuthStore()
const recipeStore = useRecipeStore()

// --- Filter-Logik (für Dropdown) ---
const tagToAdd = ref<string>('')

// Berechnete Liste für das Dropdown: Zeigt nur Tags an, die noch nicht aktiv sind
const availableTagsForDropdown = computed(() => {
  return availableTags.filter((tag) => !recipeStore.activeTagFilters.includes(tag.name))
})

function handleAddFilter() {
  if (tagToAdd.value) {
    recipeStore.addTagFilter(tagToAdd.value)
    tagToAdd.value = ''
  }
}

onMounted(() => {
  console.log('HomeView wurde gemountet, rufe fetchRecipes auf...')
  recipeStore.fetchRecipes()
})

async function toggleFavorite(recipeId: string) {
  // .prevent.stop am Button verhindert, dass die Navigation ausgelöst wird.
  await recipeStore.toggleFavoriteAction(recipeId)
  // Die 'filteredRecipes'-Liste wird sich dank des Getters im Store automatisch neu anordnen
}
</script>

<template>
  <div>
    <h2>Willkommen {{ authStore.userId }}!</h2>

    <div class="view-header">
      <h3>Deine Rezepte</h3>
      <router-link :to="{ name: 'create-recipe' }" class="btn-new-recipe">
        + Neues Rezept
      </router-link>
    </div>

    <div class="filter-bar">
      <select
        v-if="availableTagsForDropdown.length > 0"
        v-model="tagToAdd"
        @change="handleAddFilter"
        class="filter-select"
      >
        <option value="" disabled selected>Filter hinzufügen... ▼</option>
        <option v-for="tag in availableTagsForDropdown" :key="tag.name" :value="tag.name">
          {{ tag.name }}
        </option>
      </select>

      <div class="active-filters">
        <span
          v-for="tag in recipeStore.activeTagFilters"
          :key="tag"
          class="tag"
          :class="[getTagColorClassByName(tag), 'interactive']"
          @click="recipeStore.removeTagFilter(tag)"
          title="Filter entfernen"
        >
          {{ tag }}
          <span class="remove-tag">×</span>
        </span>
      </div>

      <button
        v-if="recipeStore.activeTagFilters.length > 0"
        @click="recipeStore.clearTagFilters()"
        class="filter-clear-btn"
      >
        Alle zurücksetzen
      </button>
    </div>

    <div class="recipe-list-container">
      <p v-if="recipeStore.isLoading">Lade Rezepte...</p>
      <p v-else-if="recipeStore.error" style="color: red">Fehler: {{ recipeStore.error }}</p>

      <div v-else-if="recipeStore.filteredRecipes.length > 0" class="recipe-grid">
        <router-link
          v-for="recipe in recipeStore.filteredRecipes"
          :key="recipe.id"
          :to="{ name: 'recipe-detail', params: { id: recipe.id } }"
          class="recipe-card-link"
        >
          <div class="recipe-card">
            <div class="recipe-header">
              <h4>{{ recipe.title }}</h4>
              <button
                class="btn-fav"
                :class="{ 'is-loading': recipeStore.togglingFavoriteId === recipe.id }"
                @click.prevent.stop="toggleFavorite(recipe.id)"
                :aria-pressed="recipe.isFavorite"
                :title="recipe.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'"
              >
                <span v-if="recipeStore.togglingFavoriteId === recipe.id">…</span>
                <span v-else>{{ recipe.isFavorite ? '★' : '☆' }}</span>
              </button>
            </div>
            <RecipeTags :tags="recipe.tags" />
          </div>
        </router-link>
      </div>
      <p v-else-if="recipeStore.recipes.length > 0 && recipeStore.filteredRecipes.length === 0">
        Keine Rezepte gefunden, die allen Filtern entsprechen.
      </p>
      <p v-else>Du hast noch keine Rezepte erstellt.</p>
    </div>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
h2 {
  margin-bottom: 2rem;
  color: var(--secondary-color);
}
h3 {
  margin: 0rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.3rem;
  color: var(--primary-color);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.recipe-card {
  background-color: var(--card-background);
  color: var(--text-color);
  border-radius: 6px;
  padding: 1rem 1.2rem;
  border: 0.5px solid var(--border-color);
  box-shadow: var(--box-shadow);
  transition:
    transform 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover);
}

.recipe-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 0.8rem;
}

.recipe-card-link:hover .recipe-card {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover);
}

.recipe-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  min-height: auto;
}

.recipe-header h4 {
  flex-grow: 1;
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p[style*='color: red;'] {
  color: var(--danger-color) !important;
  font-style: normal;
  font-weight: 500;
}

.recipe-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-new-recipe {
  display: block;
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-new-recipe:hover {
  text-decoration: underline;
}

.filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.filter-select {
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--medium-gray);
  background-color: var(--card-background);
  color: var(--text-light);
  cursor: pointer;
  height: 1.8rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.filter-select:focus {
  outline-color: var(--primary-color);
}

.filter-clear-btn {
  background: none;
  border: none;
  color: var(--text-light);
  text-decoration: underline;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: auto;
  padding-right: 0;
  padding-left: 0.5rem;
}
.filter-clear-btn:hover {
  color: var(--danger-color);
}

.btn-fav {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
  color: var(--text-light);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.btn-fav:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.btn-fav.is-loading {
  opacity: 0.6;
  cursor: progress;
}
</style>
