<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
const authStore = useAuthStore();
</script>

<template>
  <div>
    <h2>Willkommen {{ authStore.userId }}!</h2>
    <p>Hier kommen bald deine Rezepte hin.</p>
    <button @click="authStore.logout()">Logout</button>
  </div>
</template>
