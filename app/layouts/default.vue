<script setup>
import { useInfraStore } from "@ogw_front/stores/infra";

import { useUIStore } from "@vease/stores/ui";
import DrawerManager from "@vease/components/Layout/DrawerManager";
import MainNavigation from "@vease/components/Layout/MainNavigation";

import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers";
import GlassCard from "@ogw_front/components/GlassCard";
import InfraConnected from "@ogw_front/components/InfraConnected";

const UIStore = useUIStore();
const infraStore = useInfraStore();

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
</script>

<template>
  <v-app>
    <MainNavigation />

    <v-main class="custom-background dropzone">
      <GlassCard
        variant="ui"
        padding="pa-0"
        class="island-wrapper overflow-hidden"
      >
        <NuxtPage style="z-index: 1" class="fill-height" />
      </GlassCard>

      <InfraConnected>
        <DrawerManager
          :ui-store="UIStore"
          @files-dropped="handleFilesDropped"
        />
      </InfraConnected>
    </v-main>

    <v-progress-linear
      v-if="infraStore.microservices_busy"
      indeterminate
      color="white"
      class="position-fixed top-0"
      style="z-index: 10001"
    />

    <FeedBackSnackers />
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
  backdrop-filter: blur(4px);
  z-index: 98;
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
  z-index: 99;
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
