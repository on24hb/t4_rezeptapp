<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/AuthStore'

const authStore = useAuthStore()
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
  background-color: var(--header-background);
  border-bottom: 1px solid var(--border-color);
  padding: 0.8rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

header h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--primary-color);
}

.logout-button {
  padding: 0.4rem 0.8rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
}

.logout-button:hover {
  opacity: 0.8;
}

main {
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
