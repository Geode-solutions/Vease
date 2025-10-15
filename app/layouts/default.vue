<template>
  <v-app>
    <v-main
      class="custom-background drop-zone"
      @dragover="UIStore.setShowDropZone(true)"
      @mousemove="handleMouseMove"
    >
      <v-row class="fill-height pa-2 mr-1">
        <v-col cols="12" class="pa-1">
          <NuxtPage style="z-index: 1" />
        </v-col>
      </v-row>

      <LayoutTopBar />
      <LayoutSideBar />
      <FeedBackSnackers />

      <div
        class="icon-container"
        :class="{ show: UIStore.showButton || UIStore.showStepImportMenu }"
      >
        <v-btn
          class="icon-style step-import-btn"
          color="white"
          @click="UIStore.setShowStepper(true)"
          icon
          style="border-radius: 20%"
          v-tooltip.left="'Import'"
        >
          <v-icon>mdi-file-upload-outline</v-icon>
        </v-btn>

        <v-btn
          class="icon-style create-point-btn"
          color="white"
          @click="openCreateTools"
          icon
          style="border-radius: 20%"
          v-tooltip.left="'Create'"
        >
          <v-icon>mdi-shape-plus-outline</v-icon>
        </v-btn>
      </div>

      <v-navigation-drawer
        class="rounded align-start"
        radius="10px"
        :width="500"
        location="right"
        temporary
        v-model="UIStore.showStepper"
      >
        <StepImport
          :files="UIStore.droppedFiles"
          @close="UIStore.setShowStepper(false)"
        />
      </v-navigation-drawer>

      <v-navigation-drawer
        class="rounded align-start"
        radius="10px"
        :width="500"
        location="right"
        temporary
        v-model="UIStore.showCreateTools"
      >
        <CreateTools @select-tool="handleSelectTool" />
      </v-navigation-drawer>

      <v-navigation-drawer
        class="rounded align-start"
        radius="10px"
        :width="500"
        location="right"
        temporary
        v-model="UIStore.showCreatePoint"
      >
        <CreatePoint />
      </v-navigation-drawer>

      <v-navigation-drawer
        class="rounded align-start"
        radius="10px"
        :width="500"
        location="right"
        temporary
        v-model="UIStore.showCreateAOI"
      >
        <CreateAOI />
      </v-navigation-drawer>

      <FullScrenDropZone />
    </v-main>
    <v-progress-linear
      v-if="infra_store.microservices_busy"
      indeterminate
      color="white"
    />
  </v-app>
</template>

<script setup>
  const UIStore = useUIStore()
  const infra_store = useInfraStore()

  const handleMouseMove = (e) => {
    const screenWidth = window.innerWidth
    const threshold = 75
    if (e.clientX > screenWidth - threshold) {
      UIStore.setShowButton(true)
    } else {
      UIStore.setShowButton(false)
    }
  }

  const openCreateTools = () => {
    UIStore.setShowCreateTools(true)
    UIStore.setShowCreatePoint(false)
    UIStore.setShowCreateAOI(false)
  }

  const handleSelectTool = (tool) => {
    UIStore.setShowCreateTools(false)

    if (tool === "Point") {
      UIStore.setShowCreatePoint(true)
    } else if (tool === "AOI") {
      UIStore.setShowCreateAOI(true)
    }
  }
</script>

<style scoped>
  .drop-zone {
    background-color: transparent;
    border-width: 0;
    border: solid 0px transparent;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-container {
    position: fixed;
    top: 53%;
    right: 0;
    z-index: 1000;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .icon-container.show {
    opacity: 1;
  }

  .step-import-btn,
  .create-point-btn {
    margin-bottom: 20px;
    transition: opacity 0.3s;
  }

  .step-import-btn.show,
  .create-point-btn.show {
    opacity: 1;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s ease;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateX(100%);
  }
</style>
