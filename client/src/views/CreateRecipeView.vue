<script setup lang="ts">
import RecipeForm from '@/components/RecipeForm.vue';
</script>

<template>
  <div class="create-recipe-view">
    <h2>Neues Rezept erstellen</h2>
    <RecipeForm />
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
