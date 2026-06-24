<script setup>
import { exportProject, importProject } from "@ogw_front/composables/project_manager";
import GlassCard from "@ogw_front/components/GlassCard";
import { Status } from "@ogw_front/utils/status";
import logo from "@vease/assets/img/logo.png";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();
const infraStore = useInfraStore();

const importFileInput = ref(undefined);

function triggerImport() {
  importFileInput.value?.click();
}

function onImportFileSelected(event) {
  const project = event.target.files?.[0];
  if (!project) {
    return;
  }
  if (!project.name.toLowerCase().endsWith(".vease")) {
    event.target.value = "";
    return;
  }
  importProject(project);
  event.target.value = "";
}
</script>

<template>
  <v-app-bar
    flat
    color="transparent"
    height="70"
    elevation="0"
    class="d-flex align-center w-100 px-8"
    @mousedown.stop
  >
    <v-img :src="logo" max-height="32" max-width="32" class="mr-2" contain draggable="false" />
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
            data-testid="projectMenuButton"
          >
            Project
            <v-icon end size="18">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <GlassCard variant="panel" padding="pa-0" class="border-0 mt-2 rounded-lg">
          <v-list density="compact" bg-color="transparent" theme="dark">
            <v-list-item
              prepend-icon="mdi-download"
              title="Import Project"
              class="rounded-md"
              data-testid="importProjectButton"
              @click="triggerImport"
            />
            <v-list-item
              prepend-icon="mdi-upload"
              title="Export Project"
              class="rounded-md"
              data-testid="exportProjectButton"
              @click="exportProject()"
            />
          </v-list>
        </GlassCard>
      </v-menu>
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
        :disabled="!infraStore.microservices_connected"
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
        :disabled="!infraStore.microservices_connected"
        @click="UIStore.setShowCreateTools(!UIStore.showCreateTools)"
      >
        Create
      </v-btn>
    </div>

    <input
      ref="importFileInput"
      type="file"
      accept=".vease"
      class="d-none"
      data-testid="importProjectInput"
      @change="onImportFileSelected"
    />
  </v-app-bar>
</template>

<style scoped>
:deep(.v-toolbar__content) {
  overflow: visible !important;
}
</style>
