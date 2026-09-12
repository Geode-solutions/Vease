<script setup lang="ts">
import AuthAccount from "@vease/components/Auth/Account.vue";
import AuthLogin from "@vease/components/Auth/Login.vue";
import { useAuth } from "@vease/composables/auth";

const { isUserAuthenticated } = useAuth();
</script>

<template>
  <AuthLogin v-if="!isUserAuthenticated" />
  <AuthAccount v-else />
</template>
