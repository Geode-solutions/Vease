<template>
  <v-app>
    <v-main
      class="custom-background drop-zone"
      @dragover.prevent="UIStore.setShowDropZone(true)"
      @dragleave.prevent="UIStore.setShowDropZone(false)"
      @drop="onDrop"
      @mousemove="handleMouseMove"
    >
      <v-row class="fill-height pa-2 mr-1">
        <v-col cols="12" class="pa-1">
          <NuxtPage style="z-index: 1" />
        </v-col>
      </v-row>

      <TopBar />
      <SideBar />
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
        >
          <v-icon>mdi-file-upload-outline</v-icon>
        </v-btn>

        <v-btn
          class="icon-style create-point-btn"
          color="white"
          @click="UIStore.setShowCreatePointMenu(true)"
          icon
          style="border-radius: 20%"
        >
          <v-icon>mdi-shape-plus-outline</v-icon>
        </v-btn>
      </div>

      <transition name="slide">
        <v-navigation-drawer
          class="rounded align-start"
          radius="10px"
          :width="500"
          location="right"
          temporary
          v-model="UIStore.showStepper"
        >
          <StepImport
            v-if="UIStore.showStepper"
            :files="UIStore.droppedFiles"
            @close="UIStore.setShowStepper(false)"
          />
        </v-navigation-drawer>
      </transition>

      <transition name="slide">
        <v-navigation-drawer
          class="rounded align-start"
          radius="10px"
          :width="500"
          location="right"
          temporary
          v-model="UIStore.showCreatePointMenu"
        >
          <CreatePointMenu
            v-if="UIStore.showCreatePointMenu"
            @close="UIStore.setShowCreatePointMenu(false)"
          />
        </v-navigation-drawer>
      </transition>

      <v-card class="drop-zone" />
    </v-main>
    <v-progress-linear v-if="infra_store.is_busy" indeterminate color="white" />
  </v-app>
</template>

<script setup>
const UIStore = useUIStore();
const feedback_store = use_feedback_store();
const infra_store = use_infra_store();

const onDrop = (e) => {
  e.preventDefault();

  const files = e.dataTransfer.files;
  const isSidebarIcon = e.dataTransfer.getData("text/plain") === "sidebar-icon";

  if (isSidebarIcon) {
    return;
  }

  if (files.length === 0) {
    feedback_store.add_error(
      500,
      "/internal",
      "Internal error",
      "No file dropped."
    );
  } else {
    feedback_store.add_success(
      `File(s) dropped : ${files[0].name} ${files[0].type}`
    );
    UIStore.setDroppedFiles(Array.from(files));
    UIStore.setShowStepper(true);
  }

  UIStore.setShowDropZone(false);
};

const handleMouseMove = (e) => {
  const screenWidth = window.innerWidth;
  const threshold = 75;
  if (e.clientX > screenWidth - threshold) {
    UIStore.setShowButton(true);
  } else {
    UIStore.setShowButton(false);
  }
};
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
  top: 50%;
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
