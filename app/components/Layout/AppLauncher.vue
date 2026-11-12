<script setup lang="ts">
import Launcher from "@ogw_front/components/Launcher.vue";
import { Status } from "@ogw_front/utils/status";
import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/run_function_when_microservices_connected";

import AuthWrapper from "@vease/components/Auth/Wrapper.vue";
import { getInfraStore } from "@vease/utils/external_stores";
import { useAuth } from "@vease/composables/auth";
import { useExtensions } from "@vease/composables/extensions";

const infraStore = getInfraStore();
const { updateExtensions } = useExtensions();
const { isUserAuthenticated, user } = useAuth();

// Token sent to the Cloud API on launch; it expires after an hour, reloading the page gets a new one
const authToken = ref<string>();

watch(
  user,
  async (newUser) => {
    authToken.value = await newUser?.getIdToken();
    if (newUser) {
      runFunctionWhenMicroservicesConnected(updateExtensions);
    }
  },
  { immediate: true },
);
</script>
<template>
  <!-- NuxtPage is always rendered (Nuxt warns otherwise): the page itself only mounts once the infra is created -->
  <NuxtPage v-slot="{ Component }">
    <Launcher
      v-if="infraStore.status != Status.CREATED"
      app-name="Vease"
      logo="/logo.png"
      :isUserAuthenticated="isUserAuthenticated"
      :auth-token="authToken"
    >
      <template #auth>
        <AuthWrapper />
      </template>
    </Launcher>
    <component :is="Component" v-else style="z-index: 1" class="fill-height" />
  </NuxtPage>
</template>
