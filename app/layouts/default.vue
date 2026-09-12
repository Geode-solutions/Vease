<script setup lang="ts">
import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import GlobalComponents from "@vease/components/Extensions/GlobalComponents.vue";
import InfraConnected from "@ogw_front/components/InfraConnected.vue";
import Launcher from "@ogw_front/components/Launcher.vue";
import { Status } from "@ogw_front/utils/status";
import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/run_function_when_microservices_connected";
import { setIsAppReady } from "@ogw_shared/scripts";
import { useAppStore } from "@ogw_front/stores/app";

import AuthWrapper from "@vease/components/Auth/Wrapper.vue";
import DrawerManager from "@vease/components/Layout/DrawerManager.vue";
import MainNavigation from "@vease/components/Layout/MainNavigation.vue";
import { getInfraStore } from "@vease/utils/external_stores";
import { useAuth } from "@vease/composables/auth";
import { useExtensions } from "@vease/composables/extensions";
import { useUIStore } from "@vease/stores/ui";

console.log("Nuxt server url", globalThis.location.host);

const UIStore = useUIStore();
const infraStore = getInfraStore();
const appStore = useAppStore();

const { updateExtensions } = useExtensions();
const { isUserAuthenticated, autoLogin } = useAuth();
autoLogin();

runFunctionWhenMicroservicesConnected(() => {
  console.log("[APP] App is ready");
  setIsAppReady(appStore.base_url, true);
});

function handleFilesDropped(files) {
  if (!UIStore.showStepper && !UIStore.showExtensions) {
    UIStore.setDroppedFiles([...files]);
    UIStore.setShowStepper(true);
  }
}

watch(
  () => [UIStore.showStepper, UIStore.showCreateTools, UIStore.showExtensions],
  ([stepper, tools, extensions], [oldStepper, oldTools, oldExtensions]) => {
    if (stepper && !oldStepper) {
      UIStore.setShowCreateTools(false);
      UIStore.setShowExtensions(false);
    }
    if (tools && !oldTools) {
      UIStore.setShowStepper(false);
      UIStore.setShowExtensions(false);
    }
    if (extensions && !oldExtensions) {
      UIStore.setShowStepper(false);
      UIStore.setShowCreateTools(false);
    }
  },
);

const { user } = useAuth();
watch(
  user,
  (newUser) => {
    if (newUser) {
      runFunctionWhenMicroservicesConnected(updateExtensions);
    }
  },
  { immediate: true },
);
</script>
<template>
  <v-app
    :class="{
      'splash-screen-active': !infraStore.microservices_connected,
      'drawer-active': UIStore.showStepper || UIStore.showCreateTools || UIStore.showExtensions,
    }"
  >
    <MainNavigation />
    <v-main class="custom-background dropzone">
      <GlassCard variant="ui" padding="pa-0" class="island-wrapper overflow-hidden">
        <Launcher
          v-if="infraStore.status != Status.CREATED"
          app-name="Vease"
          logo="/logo.png"
          :isUserAuthenticated="isUserAuthenticated"
          :email="user?.email ?? undefined"
        >
          <template #auth>
            <AuthWrapper />
          </template>
        </Launcher>
        <NuxtPage v-else style="z-index: 1" class="fill-height" />
      </GlassCard>
      <InfraConnected>
        <DrawerManager :ui-store="UIStore" @files-dropped="handleFilesDropped" />
      </InfraConnected>
    </v-main>
    <v-progress-linear
      v-if="infraStore.microservices_busy"
      indeterminate
      color="white"
      class="position-fixed top-0"
      style="z-index: 4"
    />
    <FeedBackSnackers />

    <GlobalComponents />
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
  overflow: hidden;
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
