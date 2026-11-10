<script setup lang="ts">
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { consola } from "consola";
import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/run_function_when_microservices_connected";
import { setIsAppReady } from "@ogw_shared/scripts";
import { useAppStore } from "@ogw_front/stores/app";

import AppDrawers from "@vease/components/Layout/AppDrawers.vue";
import AppLauncher from "@vease/components/Layout/AppLauncher.vue";
import AppOverlays from "@vease/components/Layout/AppOverlays.vue";
import MainNavigation from "@vease/components/Layout/MainNavigation.vue";
import { getInfraStore } from "@vease/utils/external_stores";
import { useAuth } from "@vease/composables/auth";
import { useExclusiveDrawers } from "@vease/composables/exclusive_drawers";
import { useUIStore } from "@vease/stores/ui";

// The e2e desktop harness parses this line from Electron stdout (tests/e2e/utils/navigate.ts); consola's styled browser output breaks that match, so it stays a plain console.log.
// oxlint-disable-next-line no-console
console.log("Nuxt server url", globalThis.location.host);

const UIStore = useUIStore();
const infraStore = getInfraStore();
const appStore = useAppStore();

const { autoLogin } = useAuth();
autoLogin();

runFunctionWhenMicroservicesConnected(() => {
  consola.info("[APP] App is ready");
  setIsAppReady(appStore.base_url, true);
});

useExclusiveDrawers();
</script>
<template>
  <v-app
    :class="{
      'splash-screen-active': !infraStore.microservices_connected,
      'drawer-active':
        UIStore.showStepper ||
        UIStore.showCreateTools ||
        UIStore.showExtensions ||
        UIStore.showCrsAlign,
    }"
  >
    <MainNavigation />
    <v-main class="custom-background dropzone">
      <GlassCard variant="ui" padding="pa-0" class="island-wrapper overflow-hidden">
        <AppLauncher />
      </GlassCard>
      <AppDrawers />
    </v-main>
    <v-progress-linear
      v-if="infraStore.microservices_busy"
      data-testid="microservicesBusyIndicator"
      indeterminate
      color="white"
      class="position-fixed top-0"
      style="z-index: 4"
    />
    <AppOverlays />
  </v-app>
</template>
<style scoped>
.v-app {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
.v-main {
  height: 100vh;
}
:deep(.v-main__wrap) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.island-wrapper {
  flex-grow: 1;
  height: 99%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 0;
  padding: 0;
}
.custom-background {
  position: relative;
  /* clip, not hidden: the island overflows by a few pixels and a hidden overflow can still be scrolled programmatically (scrollIntoView), shifting the whole viewer */
  overflow: clip;
}
.custom-background::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
}
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  will-change: backdrop-filter;
  transform: translateZ(0);
  isolation: isolate;
  backface-visibility: hidden;
}

.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition:
    opacity 0.1s linear,
    backdrop-filter 0.1s linear !important;
}

.drawer-container {
  position: fixed;
  top: 0;
  height: calc(100vh - 100px) !important;
  margin-top: 84px;
  padding: 16px;
  z-index: 3;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.v-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>
