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
  <v-app-bar flat color="transparent" class="ma-1" height="60" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        :src="logo"
        max-height="50"
        max-width="50"
        class="ml-3 mr-0"
        contain
        draggable="false"
      />
      <h2 style="color: white" class="ml-2 mb-1 title-text mr-8">Vease</h2>

      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            v-bind="props"
            class="text-none font-weight-bold"
          >
            <v-icon start>mdi-folder-star-outline</v-icon>
            Project
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" rounded="lg">
          <v-list-item
            prepend-icon="mdi-download"
            title="Import Project"
            @click="triggerImport"
          />
          <v-list-item
            prepend-icon="mdi-upload"
            title="Export Project"
            @click="exportProject()"
          />
        </v-list>
      </v-menu>

      <v-btn
        variant="text"
        color="white"
        class="text-none font-weight-bold"
        @click="UIStore.setShowExtensions(!UIStore.showExtensions)"
      >
        <v-icon start>mdi-puzzle-outline</v-icon>
        Extensions
      </v-btn>

      <v-spacer />

      <!-- Action Buttons -->
      <div class="d-flex align-center bg-white rounded-pill pa-1 mr-4">
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          class="text-none px-6 font-weight-bold mr-1"
          @click="UIStore.setShowStepper(!UIStore.showStepper)"
        >
          <v-icon start size="20">mdi-file-upload-outline</v-icon>
          Import
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          rounded="pill"
          class="text-none px-6 font-weight-bold"
          @click="UIStore.setShowCreateTools(!UIStore.showCreateTools)"
        >
          <v-icon start size="20">mdi-shape-plus-outline</v-icon>
          Create
        </v-btn>
      </div>
    </v-row>

    <input
      ref="importFileInput"
      type="file"
      accept=".vease"
      style="display: none"
      @change="onImportFileSelected"
    />
  </v-app-bar>
</template>
