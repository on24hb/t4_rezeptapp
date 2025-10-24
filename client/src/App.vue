<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>MealMate</h1>
    </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: #f8f9fa;
  padding: 0.8rem 2rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
}

main {
  padding: 0 2rem;
}

</style>
