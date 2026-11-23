<script setup lang="ts">
import DragAndDrop from "@ogw_front/components/DragAndDrop.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { appMode } from "@geode/opengeodeweb-front/shared/app_mode.js";
import { consola } from "consola";
import { importExtensionFile } from "@ogw_front/utils/extension";

import { useAppStore } from "@ogw_front/stores/app";
import { useInfraStore } from "@ogw_front/stores/infra";

import { formatRelativeTime } from "@/utils/format_date";
import { useExtensionMetadata } from "@/composables/extension_metadata";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { Extension } from "@/composables/extension_metadata";

const { hideHeader = false } = defineProps<{ hideHeader?: boolean }>();

const MESSAGE_TIMEOUT = 4000;

const appStore = useAppStore();
const infraStore = useInfraStore();
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showRemoveDialog = ref(false);
const extensionToRemove = ref<Extension | undefined>(undefined);

const loadedExtensions = computed(() => appStore.getLoadedExtensions());

const {
  getExtensionName,
  getExtensionDescription,
  getExtensionVersion,
  getExtensionTools,
  getExtensionToolsCount,
} = useExtensionMetadata();

async function processFiles(filesToProcess): Promise<void> {
  const validFiles = filesToProcess.filter((file) => file.name.endsWith(".vext"));
  if (validFiles.length === 0) {
    errorMessage.value = "Please drop valid extension files (.vext)";
    return;
  }
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  let successCount = 0;

  try {
    const results = await Promise.allSettled(validFiles.map((file) => importExtensionFile(file)));

    for (const result of results) {
      if (result.status === "fulfilled") {
        successCount += 1;
      } else {
        consola.error("[Extension.vue] Failed to import extension:", result.reason);
        errorMessage.value = `${result.reason.message}`;
      }
    }

    if (successCount) {
      successMessage.value = `Successfully loaded ${successCount} extension${successCount > 1 ? "s" : ""} !`;
    }
  } finally {
    loading.value = false;
    setTimeout(() => (successMessage.value = ""), MESSAGE_TIMEOUT);
  }
}

function toggleExtensionState(extension): void {
  appStore.toggleExtension(extension.id);
}

function formatDate(dateString): string {
  return formatRelativeTime(dateString);
}

function confirmRemove(extension: Extension): void {
  extensionToRemove.value = extension;
  showRemoveDialog.value = true;
}

function removeExtension(): void {
  if (extensionToRemove.value) {
    appStore.unloadExtension(extensionToRemove.value.id);
    showRemoveDialog.value = false;
    extensionToRemove.value = undefined;
  }
}
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column fill-height">
    <div v-if="!hideHeader" class="pa-4 pb-2">
      <div class="d-flex align-center mb-1">
        <v-icon icon="ph-puzzle-piece" class="mr-2 text-secondary" size="24"></v-icon>
        <h2 class="text-h6 font-weight-bold mb-0">Extensions</h2>
      </div>
      <p class="text-caption text-medium-emphasis mb-0">
        Enhance your application with additional features and tools.
      </p>
    </div>

    <v-card-text v-if="infraStore.app_mode === appMode.CLOUD" class="px-4 pb-4 overflow-y-auto">
      <p class="text-caption text-medium-emphasis font-weight-semibold">
        Feature disabled in cloud mode
      </p>
    </v-card-text>
    <v-card-text v-else class="px-4 pb-4 overflow-y-auto" :class="{ 'pt-4': hideHeader }">
      <DragAndDrop
        :multiple="true"
        accept=".vext"
        :loading="loading"
        :show-extensions="true"
        :fullscreen="false"
        :show-overlay="false"
        idle-text="Click or drag and drop"
        drop-text="Drop to Install"
        loading-text="Loading Extension..."
        @files-selected="processFiles"
      />

      <v-slide-y-transition>
        <v-alert
          v-if="successMessage"
          type="success"
          rounded="xl"
          class="mt-2 text-caption"
          closable
          @click:close="successMessage = ''"
        >
          {{ successMessage }}
        </v-alert>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-alert
          v-if="errorMessage"
          type="info"
          rounded="xl"
          class="mt-2 text-caption"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-slide-y-transition>

      <v-fade-transition>
        <div v-if="loadedExtensions.length" class="mt-4">
          <div class="d-flex align-center mb-2 text-subtitle-2 font-weight-semibold">
            <v-icon icon="ph-seal-check" class="mr-1" size="18" />
            Active Extensions
            <v-chip size="x-small" color="primary" variant="tonal" class="ml-2" elevation="0">
              {{ loadedExtensions.length }}
            </v-chip>
          </div>

          <v-row dense>
            <v-col v-for="(extension, index) in loadedExtensions" :key="index" cols="12">
              <v-scale-transition :delay="index * 50">
                <v-expansion-panels variant="accordion" class="bg-transparent">
                  <v-expansion-panel
                    rounded="xl"
                    class="glass-panel mb-2"
                    elevation="0"
                    :style="{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: extension.enabled ? 1 : 0.6,
                    }"
                  >
                    <v-expansion-panel-title class="pa-3">
                      <template v-slot:default="{ expanded }">
                        <v-hover v-slot="{ isHovering, props: hoverProps }">
                          <div v-bind="hoverProps" class="d-flex align-center ga-2 w-100">
                            <v-sheet
                              class="d-flex align-center justify-center flex-shrink-0 extension-icon"
                              :color="
                                extension.enabled
                                  ? isHovering || expanded
                                    ? 'primary'
                                    : 'rgba(var(--v-theme-primary), 0.12)'
                                  : 'rgba(var(--v-theme-on-surface), 0.06)'
                              "
                              rounded="circle"
                            >
                              <v-icon
                                icon="ph-puzzle-piece"
                                size="20"
                                :color="
                                  extension.enabled
                                    ? isHovering || expanded
                                      ? 'on-primary'
                                      : 'primary'
                                    : 'grey'
                                "
                              />
                            </v-sheet>

                            <div class="flex-grow-1 min-w-0">
                              <div
                                class="text-caption font-weight-semibold mb-0"
                                :class="extension.enabled ? 'text-high-emphasis' : 'text-grey'"
                              >
                                {{ getExtensionName(extension) }}
                              </div>

                              <div
                                class="text-caption mb-1 text-wrap"
                                :class="extension.enabled ? 'text-medium-emphasis' : 'text-grey'"
                              >
                                {{ getExtensionDescription(extension) }}
                              </div>

                              <div class="d-flex align-center ga-1 flex-wrap">
                                <v-chip
                                  v-if="getExtensionVersion(extension)"
                                  size="x-small"
                                  variant="outlined"
                                  color="primary"
                                >
                                  v{{ getExtensionVersion(extension) }}
                                </v-chip>

                                <v-chip
                                  size="x-small"
                                  :color="extension.enabled ? 'primary' : 'grey'"
                                  variant="outlined"
                                >
                                  <v-icon start size="10">ph-wrench</v-icon>
                                  {{ getExtensionToolsCount(extension) }}
                                </v-chip>

                                <v-spacer />

                                <span class="text-caption text-medium-emphasis text-no-wrap">
                                  {{ formatDate(extension.loadedAt) }}
                                </span>
                              </div>
                            </div>

                            <div class="d-flex align-center ga-1 flex-shrink-0 mr-n1">
                              <v-switch
                                :model-value="extension.enabled"
                                color="success"
                                density="compact"
                                hide-details
                                inset
                                @click.stop
                                @update:model-value="toggleExtensionState(extension)"
                              />

                              <v-btn
                                icon="ph-trash"
                                size="x-small"
                                variant="text"
                                color="error"
                                class="opacity-60"
                                @click.stop="confirmRemove(extension)"
                              />
                            </div>
                          </div>
                        </v-hover>
                      </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="px-3 pb-3">
                      <v-divider class="mb-2 opacity-10" />

                      <div class="d-flex align-center justify-space-between mb-2">
                        <div class="d-flex align-center text-caption font-weight-semibold">
                          <v-icon icon="ph-wrench" size="14" class="mr-1" />
                          Tools
                        </div>
                        <v-chip
                          size="x-small"
                          :color="extension.enabled ? 'primary' : 'grey'"
                          variant="outlined"
                        >
                          {{ getExtensionToolsCount(extension) }}
                        </v-chip>
                      </div>

                      <div
                        v-if="getExtensionTools(extension).length"
                        class="d-flex flex-column ga-2"
                      >
                        <v-hover
                          v-for="(tool, toolIndex) in getExtensionTools(extension)"
                          :key="tool.id"
                          v-slot="{ isHovering, props: toolProps }"
                        >
                          <GlassCard
                            v-bind="toolProps"
                            variant="ui"
                            padding="pa-2"
                            class="d-flex align-start ga-2 active-tool-card"
                            :style="{
                              transitionDelay: `${toolIndex * 30}ms`,
                              background: isHovering
                                ? 'rgba(var(--v-theme-primary), 0.08)'
                                : 'transparent',
                              opacity: extension.enabled ? 1 : 0.5,
                            }"
                          >
                            <v-sheet
                              class="d-flex align-center justify-center flex-shrink-0 tool-icon"
                              :color="isHovering ? 'primary' : 'rgba(var(--v-theme-primary), 0.12)'"
                              rounded="lg"
                            >
                              <v-icon
                                v-if="tool.iconType === 'icon'"
                                :icon="tool.iconSource"
                                size="14"
                                :color="isHovering ? 'on-primary' : 'primary'"
                              />
                              <v-img
                                v-else-if="tool.iconType === 'svg'"
                                :src="tool.iconSource"
                                width="14"
                                height="14"
                                contain
                                class="tool-svg-icon"
                                :class="{ 'tool-svg-icon--on-primary': isHovering }"
                              />
                            </v-sheet>

                            <div class="flex-grow-1 min-w-0">
                              <div class="d-flex align-center ga-1 mb-0">
                                <span class="text-caption font-weight-semibold">
                                  {{ tool.title }}
                                </span>
                              </div>

                              <div class="text-caption text-medium-emphasis">
                                {{ tool.description }}
                              </div>
                            </div>
                          </GlassCard>
                        </v-hover>
                      </div>

                      <v-alert
                        v-else
                        type="info"
                        variant="tonal"
                        density="compact"
                        rounded="lg"
                        class="mt-1 text-caption"
                      >
                        This extension doesn't register any tools
                      </v-alert>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-scale-transition>
            </v-col>
          </v-row>
        </div>
      </v-fade-transition>

      <v-fade-transition>
        <GlassCard
          v-if="!loadedExtensions.length"
          variant="ui"
          class="mt-4 border-opacity-10"
          padding="pa-6"
        >
          <div class="text-center">
            <v-sheet
              class="mx-auto mb-4 d-flex align-center justify-center empty-icon-wrapper"
              rounded="circle"
            >
              <v-icon icon="ph-puzzle-piece" size="36" color="primary" class="opacity-60" />
            </v-sheet>
            <div class="text-subtitle-2 font-weight-bold mb-1">No extensions loaded yet</div>
            <div class="text-caption text-medium-emphasis">
              Upload an extension file to get started
            </div>
          </div>
        </GlassCard>
      </v-fade-transition>
    </v-card-text>

    <v-dialog v-model="showRemoveDialog" max-width="400" class="remove-dialog">
      <GlassCard variant="panel" padding="pa-6">
        <v-card-title
          class="d-flex align-center text-subtitle-1 font-weight-semibold text-warning pa-0 pb-2"
        >
          <v-icon icon="ph-warning-circle" size="20" class="mr-2" color="warning" />
          Remove Extension?
        </v-card-title>

        <v-card-text class="px-0 pb-4 text-body-2">
          <div class="text-medium-emphasis mb-3">
            Are you sure you want to delete
            <span class="font-weight-bold text-high-emphasis">{{
              getExtensionName(extensionToRemove)
            }}</span
            >?
          </div>
          <v-alert type="info" variant="tonal" density="compact" rounded="xl" class="text-caption">
            <template #prepend>
              <v-icon size="14">ph-info</v-icon>
            </template>
            This will remove all tools registered by this extension.
          </v-alert>
        </v-card-text>

        <v-divider class="opacity-10" />

        <v-card-actions class="px-0 pt-3 pb-0">
          <v-spacer />
          <v-btn
            variant="text"
            color="primary"
            size="small"
            rounded="pill"
            @click="showRemoveDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            size="small"
            class="font-weight-bold"
            @click="removeExtension"
          >
            <v-icon start size="14">ph-trash</v-icon>
            Remove
          </v-btn>
        </v-card-actions>
      </GlassCard>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.min-w-0 {
  min-width: 0;
}

.remove-dialog {
  z-index: 4;
}

.extension-icon {
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
}

.tool-icon {
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
}

.empty-icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* SVG tool icons are recolored to a flat tint: dark on light themes, light on dark themes,
   reversed on the primary-filled hover state. */
.tool-svg-icon :deep(.v-img__img) {
  filter: brightness(0) !important;
}

.v-theme--dark .tool-svg-icon :deep(.v-img__img),
.tool-svg-icon.tool-svg-icon--on-primary :deep(.v-img__img) {
  filter: brightness(0) invert(1) !important;
}

.v-theme--dark .tool-svg-icon.tool-svg-icon--on-primary :deep(.v-img__img) {
  filter: brightness(0) !important;
}
</style>
