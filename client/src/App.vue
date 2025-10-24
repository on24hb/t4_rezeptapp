<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/AuthStore';

const authStore = useAuthStore();
</script>

<template>
  <header>
    <div class="header-content">
      <h1>MealMate</h1>
      <button v-if="authStore.isLoggedIn" @click="authStore.logout()" class="logout-button">
        Logout
      </button>
    </div>
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
}

.logout-button {
  padding: 0.4rem 0.8rem;
  background-color: #a32727;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
}

.logout-button:hover {
  background-color: #751717;
}

main {
  padding: 0 2rem;
}

</style>
