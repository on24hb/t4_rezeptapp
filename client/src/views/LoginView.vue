<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="login-view">
    <h2>Login</h2>
    <LoginForm />
  </div>
</template>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}
</style>
