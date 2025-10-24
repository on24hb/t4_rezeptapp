<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRecipeStore } from '../stores/RecipeStore';

const authStore = useAuthStore();

const recipeStore = useRecipeStore();

// Speichert die ID des Rezepts, das gerade angezeigt wird, oder null
 const expandedRecipeId = ref<string | null>(null);

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
</script>

<template>
  <div>
    <h2>Willkommen {{ authStore.userId }}!</h2>

    <h3>Deine Rezepte</h3>

    <p v-if="recipeStore.isLoading">Lade Rezepte...</p>
    <p v-else-if="recipeStore.error" style="color: red;">Fehler: {{ recipeStore.error }}</p>

    <ul v-else-if="recipeStore.recipes.length > 0">
    <li v-for="recipe in recipeStore.recipes" :key="recipe.id">
         <div class="recipe-header">
           <h4>{{ recipe.title }}</h4>
           <button @click="toggleDetails(recipe.id)">
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
           </div>
       </li>
     </ul>
    <p v-else>Du hast noch keine Rezepte erstellt.</p>
  </div>
</template>

<style scoped>
  h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  h4 {
    margin: 0 0 0.5rem 0;
  }

  .recipe-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 0.5rem;
   }
   .recipe-header h4 {
       margin-bottom: 0;
   }
   .recipe-details {
     margin-top: 1rem;
     padding-top: 1rem;
     border-top: 1px dashed #ccc;
   }
   .recipe-details h5 {
     margin-top: 0;
     margin-bottom: 0.5rem;
     font-weight: bold;
   }
   .recipe-details ul {
     list-style: disc;
     padding-left: 20px;
     margin-bottom: 1rem;
   }
    .recipe-details ul li {
        background-color: transparent;
        border: none;
        padding: 0;
        margin-bottom: 0.2rem;
    }
   .recipe-details p {
       margin-top: 0;
   }
   p[style*="white-space: pre-wrap;"] {
      white-space: pre-wrap;
   }

   button {
     padding: 0.4rem 0.8rem;
     background-color: #007bff;
     color: white;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     font-size: 0.8rem;
     font-weight: bold;
   }
   button:hover {
     background-color: #0056b3;
  }
</style>
