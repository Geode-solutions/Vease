<script setup>
import { useAuth } from "@vease/composables/auth";

const { register } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  errorMessage.value = "";
  if (!email.value || !password.value) {
    error.value = "Please fill in all fields";
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }
  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }
  loading.value = true;
  try {
    await register(email.value, password.value);
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      errorMessage.value = "This email is already registered";
    } else if (error.code === "auth/invalid-email") {
      errorMessage.value = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      errorMessage.value = "Password is too weak";
    } else {
      errorMessage.value = error.message || "Failed to create account";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">
        Create an Account
      </h2>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Error Message -->
        <p
          v-if="error"
          class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span v-if="loading" class="animate-spin mr-2">⟳</span>
          {{ loading ? "Creating Account..." : "Register" }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-6">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline font-medium">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
