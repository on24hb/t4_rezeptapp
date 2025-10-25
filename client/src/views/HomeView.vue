<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRecipeStore } from '../stores/RecipeStore';
// TODO: import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const recipeStore = useRecipeStore();
// Speichert die ID des Rezepts, das gerade angezeigt wird, oder null:
const expandedRecipeId = ref<string | null>(null);

// TODO: const router = useRouter();

onMounted(() => {
  console.log('HomeView wurde gemountet, rufe fetchRecipes auf...');
  recipeStore.fetchRecipes();
});

// Funktion zum Auf-/Zuklappen der Rezeptdetails
 function toggleDetails(recipeId: string) {
   if (expandedRecipeId.value === recipeId) {
     expandedRecipeId.value = null;
   } else {
     expandedRecipeId.value = recipeId;
   }
 }

 // Funktion zum Löschen eines Rezepts
 async function handleDelete(recipeId: string, recipeTitle: string) {
   if (confirm(`Möchtest du das Rezept "${recipeTitle}" wirklich löschen?`)) {
     console.log('Lösche Rezept:', recipeId);
     const success = await recipeStore.deleteRecipeAction(recipeId);
     if (success) {
       console.log('Rezept erfolgreich gelöscht.');
       // Details schließen, falls sie offen waren
       if (expandedRecipeId.value === recipeId) {
         expandedRecipeId.value = null;
       }
     } else {
       alert(`Fehler beim Löschen: ${recipeStore.error || 'Unbekannter Fehler'}`);
     }
   }
 }

 // Funktion zum Bearbeiten eines Rezepts
 function startEdit(recipeId: string) {
   console.log('Bearbeite Rezept:', recipeId);
   // TODO: Zur Bearbeitungsseite navigieren
   alert('Bearbeiten-Funktion noch nicht implementiert.');
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

    <div class="recipe-list-container">
    <p v-if="recipeStore.isLoading">Lade Rezepte...</p>
    <p v-else-if="recipeStore.error" style="color: red;">Fehler: {{ recipeStore.error }}</p>

    <div v-else-if="recipeStore.recipes.length > 0" class="recipe-grid">
      <div v-for="recipe in recipeStore.recipes" :key="recipe.id" class="recipe-card" @click="toggleDetails(recipe.id)">
        <div class="recipe-header">
           <h4>{{ recipe.title }}</h4>
           <button @click.stop="toggleDetails(recipe.id)">
            {{ expandedRecipeId === recipe.id ? 'Schließen' : 'Details' }}
           </button>
         </div>

         <div v-if="expandedRecipeId === recipe.id" class="recipe-details">
           <h5>Zutaten:</h5>
           <ul>
             <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
               {{ ingredient }}
             </li>
           </ul>
           <h5>Anleitung:</h5>
           <p style="white-space: pre-wrap;">{{ recipe.instructions }}</p>
           <div class="recipe-actions">
            <button @click.stop="startEdit(recipe.id)" class="btn-edit">
              Bearbeiten
            </button>
            <button @click.stop="handleDelete(recipe.id, recipe.title)" class="btn-delete">
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
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
   transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
   cursor: pointer;
   overflow: hidden;
 }

 .recipe-card:hover {
   transform: translateY(-2px);
   box-shadow: var(--box-shadow-hover);
 }

 .recipe-header {
   display: flex;
   align-items: center;
   margin-bottom: 0.8rem;
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

 .recipe-header button {
   background: none;
   border: 1px solid var(--border-color);
   color: var(--text-light);
   padding: 0.2rem 0.4rem;
   font-size: 0.8rem;
   border-radius: 4px;
   white-space: nowrap;
   margin-left: 0.5rem;
   flex-shrink: 0;
   cursor: pointer;
 }
 .recipe-header button:hover {
   background-color: var(--light-gray);
   color: var(--text-color);
 }

 .recipe-details {
   margin-top: 0.8rem;
   padding-top: 0.8rem;
   border-top: 1px solid var(--border-color);
   font-size: 0.9rem;
 }

 .recipe-details h5 {
   margin-top: 0;
   margin-bottom: 0.6rem;
   color: var(--text-light);
   font-size: 0.8rem;
   font-weight: 600;
   text-transform: uppercase;
   letter-spacing: 0.5px;
 }

 .recipe-details ul {
   list-style: none;
   padding-left: 0;
   margin-bottom: 1rem;
 }

 .recipe-details ul li {
   background-color: transparent;
   border: none;
   padding: 0.1rem 0;
   margin-bottom: 0;
   line-height: 1.5;
   color: var(--text-light);
 }
 .recipe-details ul li::before {
     content: '• ';
     color: var(--medium-gray);
     margin-right: 0.5em;
 }

 .recipe-details p {
   margin-top: 0;
   line-height: 1.6;
   white-space: pre-wrap;
   color: var(--text-light);
 }

 .recipe-list-container > p {
    text-align: center;
    color: var(--text-light);
    margin-top: 3rem;
    font-style: italic;
 }
 p[style*="color: red;"] {
    color: var(--danger-color) !important;
    font-style: normal;
    font-weight: 500;
 }

 .recipe-actions {
   margin-top: 1rem;
   display: flex;
   gap: 0.5rem;
 }

 .recipe-actions button {
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
