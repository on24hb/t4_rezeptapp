<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Recipe } from '../types/Recipe';
import { availableTags, type TagName } from '@/config/tags';

// --- Props ---
// Werte kommen von der übergeordneten Komponente (CreateRecipeView oder EditRecipeView)
const props = defineProps<{
  initialData?: Recipe | null;
  isLoadingExternally?: boolean;
  submitButtonText?: string;
}>();

// --- Event ---
const emit = defineEmits<{
  (e: 'submit-recipe', data: Omit<Recipe, 'id' | 'userId'>): void;
}>();

const title = ref('')
const ingredientsText = ref('')
const instructions = ref('')
const internalLoading = ref(false);
const error = ref<string | null>(null)
const selectedTags = ref<TagName[]>([]);

function ingredientsToString(ingredients: string[] | undefined): string {
    return ingredients ? ingredients.join('\n') : '';
}

function parseIngredients(text: string): string[] {
  return text.split('\n').map(line => line.trim()).filter(Boolean)
}

function initializeForm(data: Recipe | null | undefined) {
    if (data) {
        title.value = data.title;
        ingredientsText.value = ingredientsToString(data.ingredients);
        instructions.value = data.instructions;
        selectedTags.value = data.tags ? [...data.tags] as TagName[] : [];    } else {
        title.value = '';
        ingredientsText.value = '';
        instructions.value = '';
        selectedTags.value = [];
    }
    error.value = null;
}

watch(() => props.initialData, (newData) => {
    console.log('RecipeForm: initialData received or changed:', newData); // Zum Debuggen
    initializeForm(newData);
}, { immediate: true });

async function handleSubmit() {
  internalLoading.value = true
  error.value = null

  const ingredientsArray = parseIngredients(ingredientsText.value);

  // Einfache Validierung
  if (!title.value || ingredientsArray.length === 0 || !instructions.value) {
    error.value = 'Bitte fülle alle Felder aus.'
    internalLoading.value = false
    return;
  }

  // Datenobjekt für das neue Rezept
  const recipeData: Omit<Recipe, 'id' | 'userId'> = {
    title: title.value,
    ingredients: ingredientsArray,
    instructions: instructions.value.trim(),
    tags: selectedTags.value
  }

  emit('submit-recipe', recipeData);
  setTimeout(() => { internalLoading.value = false; }, 1000);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Titel:</label>
      <input type="text" id="title" v-model="title" required :disabled="props.isLoadingExternally" />
    </div>

    <div class="form-group">
      <label for="ingredients">Zutaten (pro Zeile eine Zutat):</label>
      <textarea id="ingredients" v-model="ingredientsText" rows="5" required :disabled="props.isLoadingExternally" ></textarea>
    </div>

    <div class="form-group">
      <label for="instructions">Anleitung:</label>
      <textarea id="instructions" v-model="instructions" rows="8" required :disabled="props.isLoadingExternally" ></textarea>
    </div>

    <div class="form-group">
      <label>Tags auswählen:</label>
      <div class="tag-checkbox-group">
        <div v-for="tagOption in availableTags" :key="tagOption.name" class="tag-checkbox-item">
          <input
            type="checkbox"
            :id="'tag-' + tagOption.name"
            :value="tagOption.name"
            v-model="selectedTags"
            :disabled="props.isLoadingExternally || internalLoading"
          />
          <label :for="'tag-' + tagOption.name" class="tag-label" :class="tagOption.colorClass">
            {{ tagOption.name }}
          </label>
        </div>
      </div>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>

    <button type="submit" :disabled="props.isLoadingExternally" >
    {{ (props.isLoadingExternally || internalLoading) ? 'Speichern...' : (props.submitButtonText || 'Speichern') }}
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
  text-align: center;
}
.tag-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
}
.tag-checkbox-item {
  display: flex;
  align-items: center;
}
.tag-checkbox-item input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}
.tag-label {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 4px;
  line-height: 1.4;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
.tag-checkbox-item input[type="checkbox"]:checked + .tag-label {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.301);
  font-weight: 500;
}
.tag-checkbox-item input[type="checkbox"]:not(:checked) + .tag-label:hover {
    opacity: 0.8;
}
</style>
