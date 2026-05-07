<script setup>
import { useAuth } from "@vease/composables/auth";

const { login } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await login(email.value, password.value);
  } catch (error) {
    console.error({ error });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input
      v-model="email"
      type="email"
      autocomplete="email"
      placeholder="Email"
      required
    />
    <input
      v-model="password"
      type="password"
      autocomplete="current-password"
      placeholder="Password"
      required
    />
    <button type="submit" :disabled="loading">Login</button>
  </form>
</template>
