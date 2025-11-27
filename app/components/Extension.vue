<template>
  <v-card flat rounded="xl" elevation="0" class="bg-surface">
    <v-card-title
      class="text-h4 text-primary pa-6 font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-puzzle" class="mr-3"></v-icon>
      Extensions
    </v-card-title>

    <v-card-subtitle class="px-6 pb-4 text-medium-emphasis">
      Enhance your application with additional features and tools.
    </v-card-subtitle>

    <v-card-text class="px-6 pb-6">
      <!-- Drag & Drop Zone -->
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="text-center cursor-pointer"
          :class="{
            'elevation-8': isHovering || isDragging,
            'elevation-2': !(isHovering || isDragging)
          }"
          :style="{
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            background: isHovering || isDragging ? '#f5f9ff' : '#fafafa',
            border: `2px dashed ${isHovering || isDragging ? 'rgb(var(--v-theme-primary))' : '#e0e0e0'}`,
            transform: isHovering || isDragging ? 'translateY(-2px)' : 'none',
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.6 : 1
          }"
          rounded="xl"
          @click="triggerFileDialog"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <v-card-text class="pa-8">
            <v-sheet
              class="mx-auto mb-6 d-flex align-center justify-center"
              :color="isHovering || isDragging ? 'primary' : 'grey-lighten-2'"
              :style="{
                width: '100px',
                height: '100px',
                transition: 'all 0.3s ease'
              }"
              rounded="circle"
              :elevation="isHovering || isDragging ? 4 : 0"
            >
              <v-icon
                :icon="loading ? 'mdi-loading' : 'mdi-cloud-upload'"
                size="56"
                :color="isHovering || isDragging ? 'white' : 'grey-darken-1'"
                :class="{ 'rotating': loading }"
              />
            </v-sheet>

            <div class="text-h6 font-weight-semibold mb-2" :class="isHovering || isDragging ? 'text-primary' : 'text-grey-darken-2'" style="transition: color 0.3s ease">
              {{ loading ? 'Loading Extension...' : isDragging ? 'Drop to Install' : 'Click or Drag & Drop Extension' }}
            </div>

            <div class="text-body-2 text-grey-darken-1">
              (.es.js files only)
            </div>
          </v-card-text>

          <input
            ref="hiddenFileInput"
            type="file"
            accept=".es.js"
            multiple
            class="file-input-hidden"
            @change="handleFileChange"
          />
        </v-card>
      </v-hover>

      <!-- Messages -->
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

      <!-- Loaded Extensions -->
      <v-fade-transition>
        <div v-if="loadedExtensions.length" class="mt-8">
          <div class="d-flex align-center mb-4 text-h6 font-weight-semibold text-primary">
            <v-icon icon="mdi-puzzle-check" class="mr-2" />
            Active Extensions
            <v-chip size="small" class="ml-3" color="primary" variant="flat" elevation="2">
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
                  <v-expansion-panel rounded="xl" border elevation="0" :style="{ transition: 'box-shadow 0.3s ease' }">
                    <v-expansion-panel-title class="pa-5">
                      <template v-slot:default="{ expanded }">
                        <v-hover v-slot="{ isHovering, props: hoverProps }">
                          <div v-bind="hoverProps" class="d-flex align-center ga-4" :class="expanded ? 'bg-blue-lighten-5 rounded-lg pa-2 ma-n2' : ''" :style="{ width: '100%' }">
                            <v-sheet
                              class="d-flex align-center justify-center flex-shrink-0"
                              :color="isHovering || expanded ? 'primary' : 'grey-lighten-3'"
                              :style="{
                                width: '56px',
                                height: '56px',
                                transition: 'all 0.3s ease'
                              }"
                              rounded="circle"
                              :elevation="isHovering || expanded ? 4 : 0"
                            >
                              <v-icon icon="mdi-puzzle" size="32" :color="isHovering || expanded ? 'white' : 'grey-darken-1'" />
                            </v-sheet>

                            <div class="flex-grow-1" style="min-width: 0">
                              <div class="text-body-1 font-weight-semibold text-grey-darken-4 mb-1">
                                {{ getExtensionName(extension) }}
                              </div>

                              <div class="text-body-2 text-grey-darken-1 mb-2" style="line-height: 1.5; white-space: normal; word-wrap: break-word">
                                {{ getExtensionDescription(extension) }}
                              </div>

                              <div class="d-flex align-center ga-2 flex-wrap">
                                <v-chip
                                  size="x-small"
                                  color="success"
                                  variant="flat"
                                  elevation="1"
                                >
                                  <v-icon start size="12">mdi-check-circle</v-icon>
                                  Active
                                </v-chip>

                                <v-chip
                                  v-if="getExtensionVersion(extension)"
                                  size="x-small"
                                  variant="tonal"
                                  color="primary"
                                >
                                  v{{ getExtensionVersion(extension) }}
                                </v-chip>

                                <v-chip
                                  size="x-small"
                                  color="primary"
                                  variant="flat"
                                  elevation="1"
                                >
                                  <v-icon start size="12">mdi-tools</v-icon>
                                  {{ getExtensionToolsCount(extension) }}
                                </v-chip>

                                <v-spacer />

                                <span class="text-caption text-grey" style="white-space: nowrap">
                                  {{ formatDate(extension.loadedAt) }}
                                </span>
                              </div>
                            </div>

                            <v-btn
                              icon="mdi-close"
                              size="small"
                              variant="text"
                              color="error"
                              :style="{ transition: 'all 0.2s ease', opacity: 0.7 }"
                              @click.stop="confirmRemove(extension)"
                            />
                          </div>
                        </v-hover>
                      </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="px-6 pb-6">
                      <v-divider class="mb-6" />
                      
                      <div class="d-flex align-center text-body-1 font-weight-semibold text-grey-darken-2 mb-3">
                        <v-icon icon="mdi-tools" size="20" class="mr-2" />
                        Tools Added by This Extension
                      </div>

                      <div v-if="getExtensionTools(extension).length" class="d-flex flex-column ga-2">
                        <v-fade-transition group>
                          <v-hover
                            v-for="(tool, toolIndex) in getExtensionTools(extension)"
                            :key="tool.id"
                            v-slot="{ isHovering, props: toolProps }"
                          >
                            <v-card
                              v-bind="toolProps"
                              class="d-flex align-start ga-3 pa-3"
                              :style="{
                                transitionDelay: `${toolIndex * 30}ms`,
                                transition: 'all 0.2s ease',
                                background: isHovering ? '#f5f9ff' : '#fafafa',
                                borderColor: isHovering ? 'rgba(33, 150, 243, 0.3)' : '#e0e0e0'
                              }"
                              border
                              rounded="lg"
                              :elevation="isHovering ? 2 : 0"
                            >
                              <v-sheet
                                class="d-flex align-center justify-center flex-shrink-0"
                                :color="isHovering ? 'primary' : 'blue-lighten-4'"
                                :style="{
                                  width: '40px',
                                  height: '40px',
                                  transition: 'background 0.2s ease'
                                }"
                                rounded="circle"
                              >
                                <v-icon
                                  v-if="tool.iconType === 'mdi'"
                                  :icon="tool.iconSource"
                                  size="20"
                                  :color="isHovering ? 'white' : 'primary'"
                                  :style="{ transition: 'color 0.2s ease' }"
                                />
                                <v-img
                                  v-else-if="tool.iconType === 'svg'"
                                  :src="tool.iconSource"
                                  width="20"
                                  height="20"
                                  contain
                                  :style="{
                                    transition: 'filter 0.2s ease',
                                    filter: isHovering ? 'brightness(0) invert(1)' : 'none'
                                  }"
                                />
                              </v-sheet>

                              <div class="flex-grow-1" style="min-width: 0">
                                <div class="text-body-1 font-weight-semibold text-grey-darken-4 mb-1" style="line-height: 1.4">
                                  {{ tool.title }}
                                </div>

                                <div class="text-body-2 text-grey-darken-1" style="line-height: 1.5">
                                  {{ tool.description }}
                                </div>
                              </div>
                            </v-card>
                          </v-hover>
                        </v-fade-transition>
                      </div>

                      <v-alert
                        v-else
                        type="info"
                        variant="tonal"
                        rounded="lg"
                        class="mt-2"
                      >
                        No tools registered by this extension
                      </v-alert>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-scale-transition>
            </v-col>
          </v-row>
        </div>
      </v-fade-transition>

      <!-- Empty State -->
      <v-fade-transition>
        <v-card
          v-if="!loadedExtensions.length"
          rounded="xl"
          variant="outlined"
          class="mt-8 bg-grey-lighten-4"
          :style="{ border: '2px dashed #e0e0e0' }"
        >
          <v-card-text class="text-center pa-8">
            <v-sheet
              class="mx-auto mb-4 d-flex align-center justify-center"
              color="grey-lighten-3"
              :style="{
                width: '100px',
                height: '100px'
              }"
              rounded="circle"
            >
              <v-icon icon="mdi-puzzle-outline" size="64" color="grey-lighten-1" />
            </v-sheet>
            <div class="text-body-1 font-weight-semibold text-grey-darken-2 mb-2">
              No extensions loaded yet
            </div>
            <div class="text-body-2 text-grey-darken-1">
              Upload an extension file to get started
            </div>
          </v-card-text>
        </v-card>
      </v-fade-transition>
    </v-card-text>

    <!-- Dialog Remove -->
    <v-dialog v-model="showRemoveDialog" max-width="500">
      <v-card rounded="xl" elevation="8">
        <v-card-title class="d-flex align-center text-h6 font-weight-semibold text-warning pa-6 pb-4">
          <v-icon icon="mdi-alert-circle" size="28" class="mr-3" color="warning" />
          Remove Extension?
        </v-card-title>

        <v-card-text class="px-6 pb-6 text-body-1">
          <div class="text-medium-emphasis mb-3">
            Are you sure you want to remove <span class="font-weight-bold text-high-emphasis">{{ getExtensionName(extensionToRemove) }}</span>?
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
          <v-btn
            variant="text"
            size="large"
            @click="showRemoveDialog = false"
          >
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

<script setup>
const UIStore = useUIStore()
const appStore = useAppStore()
const files = ref([])
const hiddenFileInput = ref(null)
const loading = ref(false)
const isDragging = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showRemoveDialog = ref(false)
const extensionToRemove = ref(null)

const loadedExtensions = computed(() => appStore.getLoadedExtensions())

const triggerFileDialog = () => hiddenFileInput.value?.click()

const getExtensionName = (extension) => {
  if (!extension) return 'Unknown Extension'
  if (extension.metadata?.name) return extension.metadata.name
  const filename = (extension.path || '').split('/').pop()
  return filename.replace(/\.es\.js$/, '').replace(/[-_]/g, ' ')
}

const getExtensionDescription = (extension) =>
  extension?.metadata?.description || 'Custom extension module'

const getExtensionVersion = (extension) =>
  extension?.metadata?.version || null

const handleDrop = async (event) => {
  isDragging.value = false
  const droppedFiles = [...event.dataTransfer.files].filter(f => f.name.endsWith('.es.js'))
  if (!droppedFiles.length) {
    errorMessage.value = 'Please drop valid extension files (.es.js)'
    return
  }
  await processFiles(droppedFiles)
}

const handleFileChange = async (event) => {
  const newFiles = event.target?.files
  if (!newFiles?.length) return
  await processFiles([...newFiles])
  event.target.value = ''
}

const processFiles = async (filesToProcess) => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  let successCount = 0

  try {
    for (const file of filesToProcess) {
      const fileURL = URL.createObjectURL(file)
      try {
        await appStore.loadExtension(fileURL)
        successCount++
      } catch (error) {
        errorMessage.value = `${error.message}`
      } finally {
        URL.revokeObjectURL(fileURL)
      }
    }
    if (successCount)
      successMessage.value = `Successfully loaded ${successCount} extension${successCount>1?'s':''} !`
  } finally {
    loading.value = false
    files.value = []
    setTimeout(() => (successMessage.value = ''), 4000)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) {
    return 'just now'
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  } else {
    return date.toLocaleDateString()
  }
}

const confirmRemove = (extension) => {
  extensionToRemove.value = extension
  showRemoveDialog.value = true
}

const removeExtension = () => {
  if (extensionToRemove.value) {
    appStore.unloadExtension(extensionToRemove.value.path)
    showRemoveDialog.value = false
    extensionToRemove.value = null
  }
}

const getExtensionTools = (extension) => {
  if (!extension) return []
  return UIStore.activeTools.filter(tool => tool.extensionPath === extension.path)
}

const getExtensionToolsCount = (extension) => {
  return getExtensionTools(extension).length
}
</script>

<style scoped>
.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cursor-pointer {
  cursor: pointer;
}

.file-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
