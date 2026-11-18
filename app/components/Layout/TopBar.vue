<script setup lang="ts">
import { exportProject, importProject } from "@ogw_front/composables/project_manager";
import BrandMark from "@vease/components/Layout/BrandMark.vue";
import ColorThemeToggle from "@vease/components/Layout/ColorThemeToggle.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { Status } from "@ogw_front/utils/status";
import { getInfraStore } from "@vease/utils/external_stores";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();
const infraStore = getInfraStore();

const importFileInput = useTemplateRef("importFileInput");

function triggerImport(): void {
  importFileInput.value?.click();
}

function onImportFileSelected(event): void {
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
    height="64"
    elevation="0"
    class="d-flex align-center w-100 top-bar"
    @mousedown.stop
  >
    <div class="brand-lockup d-flex align-center ga-3 mr-8">
      <BrandMark :size="32" />
      <h2 class="title-text brand-wordmark">Vease</h2>
    </div>

    <div class="d-flex ga-2">
      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="text-none font-weight-medium"
            prepend-icon="mdi-folder-star-outline"
            data-testid="projectMenuButton"
          >
            Project
            <v-icon end size="18">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <GlassCard variant="panel" padding="pa-1" rounded="lg" class="mt-2">
          <v-list density="compact" bg-color="transparent">
            <v-list-item
              prepend-icon="mdi-download"
              title="Import Project"
              class="rounded-md"
              data-testid="importProjectButton"
              @click="triggerImport()"
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
      <ColorThemeToggle />
      <v-btn
        data-testid="layoutImportButton"
        color="accent"
        variant="flat"
        rounded="pill"
        class="text-none px-6 font-weight-bold"
        :class="{ 'v-btn--active': UIStore.showStepper }"
        prepend-icon="mdi-file-upload-outline"
        :disabled="!infraStore.microservices_connected"
        @click="UIStore.setShowStepper(!UIStore.showStepper)"
      >
        Import
      </v-btn>
      <v-btn
        color="primary"
        variant="tonal"
        rounded="pill"
        class="text-none px-6 font-weight-bold"
        :class="{ 'v-btn--active': UIStore.showCreateTools }"
        data-testid="createButton"
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

/* The mark is centered on the side bar column (80 px), the right edge aligns with the island */
.top-bar {
  padding-left: 24px;
  padding-right: var(--vease-shell-gutter);
}

.brand-wordmark {
  font-size: 1.6rem;
  line-height: 1;
  letter-spacing: -0.02em;
}
</style>
