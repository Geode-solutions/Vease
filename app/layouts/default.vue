<script setup>
  import { watch } from "vue"
  import { useInfraStore } from "@ogw_front/stores/infra"
  import { useUIStore } from "@vease/stores/UI"

  import InfraConnected from "@ogw_front/components/InfraConnected"
  import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers"
  import TopBar from "@vease/components/Layout/TopBar"
  import SideBar from "@vease/components/Layout/SideBar"
  import FullScrenDropZone from "@vease/components/FullScrenDropZone"
  import CreateTools from "@vease/components/CreateTools"
  import StepImport from "@vease/components/StepImport"

  const UIStore = useUIStore()
  const infraStore = useInfraStore()

  function closeAllDrawers() {
    UIStore.setShowStepper(false)
    UIStore.setShowCreateTools(false)
    UIStore.setShowExtensions(false)
  }

  watch(
    () => [
      UIStore.showStepper,
      UIStore.showCreateTools,
      UIStore.showExtensions,
    ],
    ([stepper, tools, extensions], [oldStepper, oldTools, oldExtensions]) => {
      if (stepper && !oldStepper) {
        UIStore.setShowCreateTools(false)
        UIStore.setShowExtensions(false)
      }
      if (tools && !oldTools) {
        UIStore.setShowStepper(false)
        UIStore.setShowExtensions(false)
      }
      if (extensions && !oldExtensions) {
        UIStore.setShowStepper(false)
        UIStore.setShowCreateTools(false)
      }
    },
  )
</script>

<template>
  <v-app>
    <TopBar />
    <SideBar />

    <v-main
      class="custom-background dropzone"
      @dragover="UIStore.setShowDropZone(true)"
    >
      <div class="island-wrapper">
        <NuxtPage style="z-index: 1" class="fill-height" />
      </div>

      <InfraConnected>
        <v-fade-transition>
          <div
            v-if="
              UIStore.showStepper ||
              UIStore.showCreateTools ||
              UIStore.showExtensions
            "
            class="drawer-overlay"
            @click="closeAllDrawers"
          />
        </v-fade-transition>

        <v-fade-transition>
          <v-card
            v-if="UIStore.showStepper || UIStore.showCreateTools"
            color="transparent"
            elevation="0"
            :width="548"
            class="drawer-container right-0"
          >
            <div
              class="rounded-xl glass-panel fill-height overflow-hidden border-0"
            >
              <StepImport
                v-if="UIStore.showStepper"
                :files="UIStore.droppedFiles"
                @close="UIStore.setShowStepper(false)"
              />
              <CreateTools v-if="UIStore.showCreateTools" />
            </div>
          </v-card>
        </v-fade-transition>

        <v-fade-transition>
          <v-card
            v-if="UIStore.showExtensions"
            color="transparent"
            elevation="0"
            :width="548"
            class="drawer-container left-0"
            style="z-index: 9999"
          >
            <div
              class="rounded-xl glass-panel fill-height overflow-hidden border-0"
            >
              <Extension />
            </div>
          </v-card>
        </v-fade-transition>

        <FullScrenDropZone />
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
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0 10px 10px 0;
  }

  .custom-background {
    position: relative;
    overflow: hidden;
  }

  .custom-background::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.15;
    pointer-events: none;
  }

  .drawer-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 98;
  }

  .drawer-container {
    position: fixed;
    top: 0;
    height: calc(100vh - 100px) !important;
    margin-top: 84px;
    padding: 16px;
    z-index: 99;
  }

  .v-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .v-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
</style>
