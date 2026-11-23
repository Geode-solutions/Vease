<script setup lang="ts">
import Launcher from "@ogw_front/components/Launcher.vue";
import { Status } from "@ogw_front/utils/status";
import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/run_function_when_microservices_connected";

import AuthWrapper from "@vease/components/Auth/Wrapper.vue";
import { getInfraStore } from "@vease/utils/external_stores";
import { useAuth } from "@vease/composables/auth";
import { useColorTheme } from "@vease/composables/color_theme";
import { useExtensions } from "@vease/composables/extensions";

const infraStore = getInfraStore();
const { updateExtensions } = useExtensions();
const { isUserAuthenticated, user } = useAuth();
const { isDark } = useColorTheme();
const logo = computed(() => (isDark.value ? "/logo_dark.svg" : "/logo_light.svg"));

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
  <!-- The island clips its content for the viewer: the launcher scrolls instead, so a short window still reaches
  The load button under the account card -->
  <div
    v-if="infraStore.status != Status.CREATED"
    class="launcher-scroll"
    data-testid="launcherScroll"
  >
    <Launcher
      app-name="Vease"
      :logo="logo"
      :isUserAuthenticated="isUserAuthenticated"
      :auth-token="authToken"
    >
      <template #auth>
        <AuthWrapper />
      </template>
    </Launcher>
  </div>
  <NuxtPage v-else style="z-index: 1" class="fill-height" />
</template>

<style scoped>
.launcher-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
