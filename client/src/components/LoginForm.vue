<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  const success = await authStore.login(username.value, password.value)
  isLoading.value = false

  if (success) {
    console.log('Login erfolgreich, leite weiter...')
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div class="form-group">
      <label for="username">Benutzername:</label>
      <input type="text" id="username" v-model="username" required :disabled="isLoading" />
    </div>
    <div class="form-group">
      <label for="password">Passwort:</label>
      <input type="password" id="password" v-model="password" required :disabled="isLoading" />
    </div>
    <p v-if="authStore.loginError" class="error-message">{{ authStore.loginError }}</p>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Logge ein...' : 'Login' }}
    </button>
  </form>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #0056b3;
}
.error-message {
  color: red;
  margin-top: -0.5rem; 
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
</style>
