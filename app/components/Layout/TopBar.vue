<script setup>
  import logo from "@vease/assets/img/logo.png"
  import { useUIStore } from "@vease/stores/UI"
  import { useProjectManager } from "@ogw_front/composables/project_manager"

  const UIStore = useUIStore()
  const { importProjectFile, exportProject } = useProjectManager()

  const importFileInput = ref(null)

  function triggerImport() {
    importFileInput.value?.click()
  }

  function onImportFileSelected(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".vease")) {
      event.target.value = ""
      return
    }
    importProjectFile(file)
    event.target.value = ""
  }
</script>

<template>
  <v-app-bar
    flat
    color="transparent"
    height="90"
    style="padding: 0 10px"
    elevation="0"
  >
    <div
      class="d-flex align-center w-100 px-8 glass-panel rounded-xl"
      style="height: 70px"
    >
      <v-img
        :src="logo"
        max-height="32"
        max-width="32"
        class="mr-2"
        contain
        draggable="false"
      />
      <h2 class="title-text font-michroma mr-8 text-h5">Vease</h2>

      <div class="d-flex ga-2">
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              color="white"
              v-bind="props"
              class="text-none font-weight-medium rounded-lg"
              prepend-icon="mdi-folder-star-outline"
            >
              Project
              <v-icon end size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list
            density="compact"
            class="glass-panel border-0 mt-2 rounded-lg"
          >
            <v-list-item
              prepend-icon="mdi-download"
              title="Import Project"
              class="rounded-md"
              @click="triggerImport"
            />
            <v-list-item
              prepend-icon="mdi-upload"
              title="Export Project"
              class="rounded-md"
              @click="exportProject()"
            />
          </v-list>
        </v-menu>

        <v-btn
          variant="text"
          color="white"
          class="text-none font-weight-medium rounded-lg"
          prepend-icon="mdi-puzzle-outline"
          @click="UIStore.setShowExtensions(!UIStore.showExtensions)"
        >
          Extensions
        </v-btn>
      </div>

      <v-spacer />

      <!-- Action Buttons -->
      <div class="d-flex align-center ga-3">
        <v-btn
          color="white"
          variant="tonal"
          rounded="lg"
          class="text-none px-6 font-weight-bold"
          prepend-icon="mdi-file-upload-outline"
          @click="UIStore.setShowStepper(!UIStore.showStepper)"
        >
          Import
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          class="text-none px-6 font-weight-bold"
          prepend-icon="mdi-shape-plus-outline"
          @click="UIStore.setShowCreateTools(!UIStore.showCreateTools)"
        >
          Create
        </v-btn>
      </div>
    </div>

    <input
      ref="importFileInput"
      type="file"
      accept=".vease"
      class="d-none"
      @change="onImportFileSelected"
    />
  </v-app-bar>
</template>

<style scoped>
  :deep(.v-toolbar__content) {
    overflow: visible !important;
  }
</style>
