<script setup>
import AuthAccount from "@vease/components/Auth/Account";
import AuthLogin from "@vease/components/Auth/Login";
import { useAuth } from "@vease/composables/auth";

const { isUserAuthenticated } = useAuth();
</script>

<template>
  <AuthLogin v-if="!isUserAuthenticated" />
  <AuthAccount v-else />
</template>
