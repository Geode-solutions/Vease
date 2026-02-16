<script setup>
  import DragAndDrop from "@ogw_front/components/DragAndDrop"
  import { formatRelativeTime } from "@/utils/formatDate"
  import { useExtensionManager } from "@vease/composables/extension_manager"
  import { useExtensionMetadata } from "@/composables/useExtensionMetadata"
  import { useExtensionsStore } from "@vease/stores/extensions"
  import { useUIStore } from "@vease/stores/UI"

  const MESSAGE_TIMEOUT = 4000

  const UIStore = useUIStore()
  const extensionsStore = useExtensionsStore()
  const loading = ref(false)
  const errorMessage = ref("")
  const successMessage = ref("")
  const showRemoveDialog = ref(false)
  const extensionToRemove = ref(null)

  const loadedExtensions = computed(() => extensionsStore.getLoadedExtensions())

  const {
    getExtensionName,
    getExtensionDescription,
    getExtensionVersion,
    getExtensionTools,
    getExtensionToolsCount,
  } = useExtensionMetadata()

  async function processFiles(filesToProcess) {
    const validFiles = filesToProcess.filter((file) =>
      file.name.endsWith(".vext"),
    )
    if (!validFiles.length) {
      errorMessage.value = "Please drop valid extension files (.vext)"
      return
    }
    errorMessage.value = ""
    successMessage.value = ""
    loading.value = true

    let successCount = 0
    const extensionManager = useExtensionManager()

    try {
      const results = await Promise.allSettled(
        validFiles.map((file) => extensionManager.importExtensionFile(file)),
      )

      for (const result of results) {
        if (result.status === "fulfilled") {
          successCount += 1
        } else {
          console.error(
            "[Extension.vue] Failed to import extension:",
            result.reason,
          )
          errorMessage.value = `${result.reason.message}`
        }
      }

      if (successCount) {
        successMessage.value = `Successfully loaded ${successCount} extension${successCount > 1 ? "s" : ""} !`
      }
    } finally {
      loading.value = false
      setTimeout(() => (successMessage.value = ""), MESSAGE_TIMEOUT)
    }
  }

  function toggleExtensionState(extension) {
    extensionsStore.toggleExtension(extension.id)
  }

  function formatDate(dateString) {
    return formatRelativeTime(dateString)
  }

  function confirmRemove(extension) {
    extensionToRemove.value = extension
    showRemoveDialog.value = true
  }

  function removeExtension() {
    if (extensionToRemove.value) {
      extensionsStore.unloadExtension(extensionToRemove.value.id)
      showRemoveDialog.value = false
      extensionToRemove.value = null
    }
  }
</script>

<template>
  <v-card
    flat
    color="transparent"
    class="d-flex flex-column fill-height"
    theme="dark"
  >
    <div class="pa-6">
      <div class="d-flex align-center mb-2">
        <v-icon
          icon="mdi-puzzle"
          class="mr-3 text-secondary"
          size="32"
        ></v-icon>
        <h2 class="text-h4 font-weight-bold text-white">Extensions</h2>
      </div>
      <p class="text-white opacity-80">
        Enhance your application with additional features and tools.
      </p>
    </div>

    <v-card-text class="px-6 pb-6 overflow-y-auto">
      <DragAndDrop
        :multiple="true"
        accept=".vext"
        :loading="loading"
        :show-extensions="true"
        idle-text="Click or Drag & Drop Extension"
        drop-text="Drop to Install"
        loading-text="Loading Extension..."
        @files-selected="processFiles"
      />

      <v-slide-y-transition>
        <v-alert
          v-if="successMessage"
          type="success"
          rounded="xl"
          class="mt-4"
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
          class="mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-slide-y-transition>

      <v-fade-transition>
        <div v-if="loadedExtensions.length" class="mt-8">
          <div
            class="d-flex align-center mb-4 text-h6 font-weight-semibold text-white"
          >
            <v-icon icon="mdi-puzzle-check" class="mr-2" />
            Active Extensions
            <v-chip
              size="small"
              color="white"
              variant="flat"
              class="ml-3 border-opacity-10 bg-white-opacity-10"
              elevation="0"
            >
              {{ loadedExtensions.length }}
            </v-chip>
          </div>

          <v-row>
            <v-col
              v-for="(extension, index) in loadedExtensions"
              :key="index"
              cols="12"
            >
              <v-scale-transition :delay="index * 50">
                <v-expansion-panels variant="accordion" class="bg-transparent">
                  <v-expansion-panel
                    rounded="xl"
                    class="glass-panel border-white border-opacity-10 mb-3"
                    elevation="0"
                    :style="{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: extension.enabled ? 1 : 0.6,
                    }"
                  >
                    <v-expansion-panel-title class="pa-5">
                      <template v-slot:default="{ expanded }">
                        <v-hover v-slot="{ isHovering, props: hoverProps }">
                          <div
                            v-bind="hoverProps"
                            class="d-flex align-center ga-4 w-100"
                          >
                            <v-sheet
                              class="d-flex align-center justify-center flex-shrink-0 extension-icon"
                              :color="
                                extension.enabled
                                  ? isHovering || expanded
                                    ? 'white'
                                    : 'rgba(255, 255, 255, 0.15)'
                                  : 'rgba(255, 255, 255, 0.08)'
                              "
                              rounded="circle"
                            >
                              <v-icon
                                icon="mdi-puzzle"
                                size="32"
                                :color="
                                  extension.enabled
                                    ? isHovering || expanded
                                      ? 'white'
                                      : 'white'
                                    : 'grey'
                                "
                              />
                            </v-sheet>

                            <div class="flex-grow-1 min-w-0">
                              <div
                                class="text-body-1 font-weight-semibold mb-1"
                                :class="
                                  extension.enabled ? 'text-white' : 'text-grey'
                                "
                              >
                                {{ getExtensionName(extension) }}
                              </div>

                              <div
                                class="text-body-2 mb-2 text-wrap"
                                :class="
                                  extension.enabled ? 'text-white' : 'text-grey'
                                "
                              >
                                {{ getExtensionDescription(extension) }}
                              </div>

                              <div class="d-flex align-center ga-2 flex-wrap">
                                <v-chip
                                  v-if="getExtensionVersion(extension)"
                                  size="x-small"
                                  variant="outlined"
                                  color="white"
                                  class="border-opacity-20"
                                >
                                  v{{ getExtensionVersion(extension) }}
                                </v-chip>

                                <v-chip
                                  size="x-small"
                                  :color="extension.enabled ? 'white' : 'grey'"
                                  variant="outlined"
                                  class="border-opacity-20"
                                >
                                  <v-icon start size="12">mdi-tools</v-icon>
                                  {{ getExtensionToolsCount(extension) }}
                                </v-chip>

                                <v-spacer />

                                <span
                                  class="text-caption text-white opacity-70 text-no-wrap"
                                >
                                  {{ formatDate(extension.loadedAt) }}
                                </span>
                              </div>
                            </div>

                            <div
                              class="d-flex align-center ga-1 flex-shrink-0 mr-n2"
                            >
                              <v-switch
                                :model-value="extension.enabled"
                                color="success"
                                density="compact"
                                hide-details
                                inset
                                @click.stop
                                @update:model-value="
                                  toggleExtensionState(extension)
                                "
                              />

                              <v-btn
                                icon="mdi-delete"
                                size="small"
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

                    <v-expansion-panel-text class="px-6 pb-6">
                      <v-divider class="mb-4 opacity-10" />

                      <div
                        class="d-flex align-center justify-space-between mb-4"
                      >
                        <div
                          class="d-flex align-center text-subtitle-1 font-weight-semibold text-white"
                        >
                          <v-icon icon="mdi-tools" size="18" class="mr-2" />
                          Tools
                        </div>
                        <v-chip
                          size="small"
                          :color="extension.enabled ? 'white' : 'grey'"
                          variant="outlined"
                          class="border-opacity-20"
                        >
                          {{ getExtensionToolsCount(extension) }}
                        </v-chip>
                      </div>

                      <div
                        v-if="getExtensionTools(extension).length"
                        class="d-flex flex-column ga-3"
                      >
                        <v-hover
                          v-for="(tool, toolIndex) in getExtensionTools(
                            extension,
                          )"
                          :key="tool.id"
                          v-slot="{ isHovering, props: toolProps }"
                        >
                          <v-card
                            v-bind="toolProps"
                            class="d-flex align-start ga-3 pa-4 border-white border-opacity-10 active-tool-card"
                            :style="{
                              transitionDelay: `${toolIndex * 30}ms`,
                              background: isHovering
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'transparent',
                              opacity: extension.enabled ? 1 : 0.5,
                            }"
                            variant="outlined"
                            rounded="lg"
                          >
                            <v-sheet
                              class="d-flex align-center justify-center flex-shrink-0 tool-icon"
                              :color="
                                isHovering
                                  ? 'primary'
                                  : 'rgba(255, 255, 255, 0.1)'
                              "
                              rounded="lg"
                            >
                              <v-icon
                                v-if="tool.iconType === 'mdi'"
                                :icon="tool.iconSource"
                                size="20"
                                color="white"
                                :class="{ 'opacity-100': isHovering }"
                              />
                              <v-img
                                v-else-if="tool.iconType === 'svg'"
                                :src="tool.iconSource"
                                width="20"
                                height="20"
                                contain
                                class="svg-white-filter"
                              />
                            </v-sheet>

                            <div class="flex-grow-1 min-w-0">
                              <div class="d-flex align-center ga-2 mb-1">
                                <span
                                  class="text-body-2 font-weight-semibold text-white"
                                >
                                  {{ tool.title }}
                                </span>
                              </div>

                              <div class="text-caption text-white opacity-80">
                                {{ tool.description }}
                              </div>
                            </div>
                          </v-card>
                        </v-hover>
                      </div>

                      <v-alert
                        v-else
                        type="info"
                        variant="tonal"
                        density="compact"
                        rounded="lg"
                        class="mt-2 text-caption"
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
        <v-card
          v-if="!loadedExtensions.length"
          rounded="xl"
          class="mt-8 glass-panel border-opacity-10"
          variant="flat"
        >
          <v-card-text class="text-center pa-10">
            <v-sheet
              class="mx-auto mb-6 d-flex align-center justify-center empty-icon-wrapper"
              rounded="circle"
            >
              <v-icon
                icon="mdi-puzzle-outline"
                size="64"
                color="white"
                class="opacity-30"
              />
            </v-sheet>
            <div class="text-h6 font-weight-bold text-white mb-2">
              No extensions loaded yet
            </div>
            <div class="text-body-1 text-white opacity-60">
              Upload an extension file to get started
            </div>
          </v-card-text>
        </v-card>
      </v-fade-transition>
    </v-card-text>

    <v-dialog v-model="showRemoveDialog" max-width="500" class="remove-dialog">
      <v-card rounded="xl" class="glass-panel" theme="dark">
        <v-card-title
          class="d-flex align-center text-h6 font-weight-semibold text-warning pa-6 pb-4"
        >
          <v-icon
            icon="mdi-alert-circle"
            size="28"
            class="mr-3"
            color="warning"
          />
          Remove Extension?
        </v-card-title>

        <v-card-text class="px-6 pb-6 text-body-1">
          <div class="text-medium-emphasis mb-3">
            Are you sure you want to remove
            <span class="font-weight-bold text-high-emphasis">{{
              getExtensionName(extensionToRemove)
            }}</span
            >?
          </div>
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="text-caption"
          >
            <template #prepend>
              <v-icon size="18">mdi-information</v-icon>
            </template>
            This will remove all tools registered by this extension.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" size="large" @click="showRemoveDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            size="large"
            @click="removeExtension"
          >
            <v-icon start>mdi-delete</v-icon>
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
  .min-w-0 {
    min-width: 0;
  }

  .remove-dialog {
    z-index: 10000;
  }

  .extension-icon {
    width: 56px;
    height: 56px;
    transition: all 0.3s ease;
  }

  .tool-icon {
    width: 40px;
    height: 40px;
    transition: all 0.2s ease;
  }

  .empty-icon-wrapper {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .rotating {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
