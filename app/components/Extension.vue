<template>
  <v-card flat rounded="xl" elevation="2" class="pa-6">
    <v-card-title
      class="text-h4 text-primary pa-0 font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-puzzle" class="mr-3"></v-icon>
      Extensions
    </v-card-title>

    <v-card-subtitle class="ma-0 text-medium">
      Enhance your application with additional features and tools.
    </v-card-subtitle>

    <v-card-text class="pt-6">
      <!-- Drag & Drop Zone -->
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="text-center cursor-pointer d-flex flex-column align-center justify-center custom-tool-card"
          :class="{
            'bg-blue-lighten-5': isHovering || isDragging,
            'elevation-6': isHovering || isDragging,
            'opacity-50 pointer-events-none': loading
          }"
          rounded="xl"
          :elevation="isHovering || isDragging ? 6 : 2"
          @click="triggerFileDialog"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <v-sheet
            class="d-flex align-center justify-center pa-4 rounded-circle mb-4 mx-auto"
            :class="isHovering || isDragging ? 'bg-primary' : 'bg-grey-lighten-3'"
            :width="90"
            :height="90"
          >
            <v-icon
              :icon="loading ? 'mdi-loading' : 'mdi-cloud-upload'"
              size="48"
              :class="{ rotating: loading, 'text-white': isHovering || isDragging }"
              :color="isHovering || isDragging ? 'white' : 'grey-darken-2'"
            />
          </v-sheet>

          <v-card-title
            class="text-h5 font-weight-bold mb-1 text-wrap"
            :class="isHovering || isDragging ? 'text-primary' : 'text-medium-emphasis'"
          >
            {{ loading ? 'Loading Extension...' : isDragging ? 'Drop to Install' : 'Click or Drag & Drop Extension' }}
          </v-card-title>

          <v-card-subtitle class="text-caption text-grey-darken-4">
            (.es.js files only)
          </v-card-subtitle>

          <v-file-input
            ref="hiddenFileInput"
            v-model="files"
            accept=".es.js"
            multiple
            hide-details
            class="file-input-hidden"
            @update:model-value="handleFileChange"
          />
        </v-card>
      </v-hover>

      <!-- Success -->
      <v-expand-transition>
        <v-alert
          v-if="successMessage"
          type="success"
          rounded="xl"
          class="mt-4"
          closable
          @click:close="successMessage = ''"
        >
          <v-icon start>mdi-check-circle</v-icon>
          {{ successMessage }}
        </v-alert>
      </v-expand-transition>

      <!-- Error -->
      <v-expand-transition>
        <v-alert
          v-if="errorMessage"
          type="error"
          rounded="xl"
          class="mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          <v-icon start>mdi-alert-circle</v-icon>
          {{ errorMessage }}
        </v-alert>
      </v-expand-transition>

      <!-- Loaded Extensions -->
      <div v-if="loadedExtensions.length" class="mt-6">
        <div class="d-flex align-center font-weight-bold mb-3 text-primary">
          <v-icon icon="mdi-puzzle-check" class="mr-2" />
          Active Extensions
          <v-chip size="small" class="ml-2" color="primary" variant="tonal">
            {{ loadedExtensions.length }}
          </v-chip>
        </div>

        <v-row>
          <v-col
            v-for="(extension, index) in loadedExtensions"
            :key="index"
            cols="12"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 1"
                rounded="xl"
                class="pa-4 d-flex align-center custom-tool-card"
              >
                <v-sheet
                  class="d-flex align-center justify-center pa-2 rounded-circle mr-3"
                  :width="56"
                  :height="56"
                  :class="isHovering ? 'bg-primary' : 'bg-grey-lighten-3'"
                >
                  <v-icon icon="mdi-puzzle" size="32" :color="isHovering ? 'white' : 'grey-darken-2'" />
                </v-sheet>

                <div class="flex-grow-1">
                  <div class="font-weight-bold">
                    {{ getExtensionName(extension) }}
                  </div>

                  <div class="text-medium-emphasis text-caption mb-2">
                    {{ getExtensionDescription(extension) }}
                  </div>

                  <div class="d-flex align-center">
                    <v-chip
                      size="x-small"
                      color="success"
                      variant="tonal"
                      prepend-icon="mdi-check-circle"
                    >
                      Active
                    </v-chip>

                    <v-chip
                      v-if="getExtensionVersion(extension)"
                      size="x-small"
                      class="ml-2"
                      variant="tonal"
                    >
                      v{{ getExtensionVersion(extension) }}
                    </v-chip>

                    <v-spacer />

                    <span class="text-disabled text-caption">
                      {{ formatDate(extension.loadedAt) }}
                    </span>
                  </div>
                </div>

                <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmRemove(extension)"
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>

      <!-- Empty -->
      <v-card
        v-else
        rounded="xl"
        variant="outlined"
        class="mt-6 text-center pa-6"
      >
        <v-icon icon="mdi-puzzle-outline" size="48" class="mb-2 text-grey" />
        <div class="font-weight-bold mb-1">
          No extensions loaded yet
        </div>
        <div class="text-medium-emphasis text-caption">
          Upload an extension file to get started
        </div>
      </v-card>
    </v-card-text>

    <!-- Dialog Remove -->
    <v-dialog v-model="showRemoveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center text-warning">
          <v-icon icon="mdi-alert" class="mr-2" />
          Remove Extension?
        </v-card-title>

        <v-card-text>
          Are you sure you want to remove <strong>{{ getExtensionName(extensionToRemove) }}</strong>?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showRemoveDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" @click="removeExtension">
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const handleFileChange = async (newFiles) => {
  if (!newFiles?.length) return
  await processFiles(newFiles)
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
        errorMessage.value = `Failed to load ${file.name}: ${error.message}`
      } finally {
        URL.revokeObjectURL(fileURL)
      }
    }
    if (successCount)
      successMessage.value = `Successfully loaded ${successCount} extension${successCount>1?'s':''}!`
  } finally {
    loading.value = false
    files.value = []
    setTimeout(() => (successMessage.value = ''), 4000)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
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
</script>

<style scoped>
.custom-tool-card {
  transition: all 0.2s ease-in-out;
}
.custom-tool-card:hover {
  transform: scale(1.03);
}

.cursor-pointer {
  cursor: pointer;
}

.file-input-hidden :deep(.v-input__control) {
  display: none;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
