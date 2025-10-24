<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRecipeStore } from '../stores/RecipeStore';

const authStore = useAuthStore();

 const recipeStore = useRecipeStore();

 onMounted(() => {
   console.log('HomeView wurde gemountet, rufe fetchRecipes auf...');
   recipeStore.fetchRecipes();
 });
 </script>

 <template>
   <div>
     <h2>Willkommen {{ authStore.userId }}!</h2>

     <h3>Deine Rezepte</h3>

     <p v-if="recipeStore.isLoading">Lade Rezepte...</p>

     <p v-else-if="recipeStore.error" style="color: red;">Fehler: {{ recipeStore.error }}</p>

     <ul v-else-if="recipeStore.recipes.length > 0">
       <li v-for="recipe in recipeStore.recipes" :key="recipe.id">
         <h4>{{ recipe.title }}</h4>
         </li>
     </ul>

     <p v-else>Du hast noch keine Rezepte erstellt.</p>

     <button @click="authStore.logout()">Logout</button>
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
 </style>
