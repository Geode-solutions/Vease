<template>
  <v-card flat rounded="xl" elevation="0" class="extension-container">
    <v-card-title
      class="text-h4 text-primary pa-6 font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-puzzle" class="mr-3 title-icon"></v-icon>
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
          class="text-center cursor-pointer drop-zone-card"
          :class="{
            'drop-zone-hover': isHovering || isDragging,
            'drop-zone-loading': loading
          }"
          rounded="xl"
          :elevation="isHovering || isDragging ? 8 : 2"
          @click="triggerFileDialog"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <v-card-text class="pa-8">
            <div class="drop-zone-content">
              <v-sheet
                class="icon-wrapper mx-auto mb-6"
                :class="{ 'icon-loading': loading, 'icon-active': isHovering || isDragging }"
                rounded="circle"
              >
                <v-icon
                  :icon="loading ? 'mdi-loading' : 'mdi-cloud-upload'"
                  size="56"
                  :class="{ 'rotating': loading }"
                />
              </v-sheet>

              <div class="drop-zone-title mb-2">
                {{ loading ? 'Loading Extension...' : isDragging ? 'Drop to Install' : 'Click or Drag & Drop Extension' }}
              </div>

              <div class="drop-zone-subtitle">
                (.es.js files only)
              </div>
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
          class="mt-4 alert-animated"
          closable
          @click:close="successMessage = ''"
        >
          <template #prepend>
            <v-icon class="success-icon">mdi-check-circle</v-icon>
          </template>
          {{ successMessage }}
        </v-alert>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-alert
          v-if="errorMessage"
          type="error"
          rounded="xl"
          class="mt-4 alert-animated"
          closable
          @click:close="errorMessage = ''"
        >
          <template #prepend>
            <v-icon class="error-icon">mdi-alert-circle</v-icon>
          </template>
          {{ errorMessage }}
        </v-alert>
      </v-slide-y-transition>

      <!-- Loaded Extensions -->
      <v-fade-transition>
        <div v-if="loadedExtensions.length" class="mt-8">
          <div class="section-header mb-4">
            <v-icon icon="mdi-puzzle-check" class="mr-2" />
            Active Extensions
            <v-chip size="small" class="ml-3 count-chip" color="primary" variant="flat">
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
                <v-expansion-panels variant="accordion" class="extension-panels">
                  <v-expansion-panel rounded="xl" class="extension-panel">
                    <v-expansion-panel-title class="extension-panel-title">
                      <template v-slot:default="{ expanded }">
                        <v-hover v-slot="{ isHovering, props: hoverProps }">
                          <div v-bind="hoverProps" class="extension-header" :class="{ 'extension-header-expanded': expanded }">
                            <v-sheet
                              class="extension-icon"
                              :class="{ 'extension-icon-active': isHovering || expanded }"
                              rounded="circle"
                            >
                              <v-icon icon="mdi-puzzle" size="32" />
                            </v-sheet>

                            <div class="extension-info">
                              <div class="extension-name">
                                {{ getExtensionName(extension) }}
                              </div>

                              <div class="extension-description">
                                {{ getExtensionDescription(extension) }}
                              </div>

                              <div class="extension-badges">
                                <v-chip
                                  size="x-small"
                                  color="success"
                                  variant="flat"
                                  class="status-chip"
                                >
                                  <v-icon start size="12">mdi-check-circle</v-icon>
                                  Active
                                </v-chip>

                                <v-chip
                                  v-if="getExtensionVersion(extension)"
                                  size="x-small"
                                  class="ml-2"
                                  variant="tonal"
                                  color="primary"
                                >
                                  v{{ getExtensionVersion(extension) }}
                                </v-chip>

                                <v-chip
                                  size="x-small"
                                  class="ml-2 tools-chip"
                                  color="primary"
                                  variant="flat"
                                >
                                  <v-icon start size="12">mdi-tools</v-icon>
                                  {{ getExtensionToolsCount(extension) }}
                                </v-chip>

                                <v-spacer />

                                <span class="extension-date">
                                  {{ formatDate(extension.loadedAt) }}
                                </span>
                              </div>
                            </div>

                            <v-btn
                              icon="mdi-close"
                              size="small"
                              variant="text"
                              color="error"
                              class="remove-btn"
                              @click.stop="confirmRemove(extension)"
                            />
                          </div>
                        </v-hover>
                      </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="extension-panel-content">
                      <v-divider class="mb-6 divider-gradient" />
                      
                      <div class="tools-section-header">
                        <v-icon icon="mdi-tools" size="20" class="mr-2" />
                        Tools Added by This Extension
                      </div>

                      <div v-if="getExtensionTools(extension).length" class="tools-list">
                        <v-fade-transition group>
                          <div
                            v-for="(tool, toolIndex) in getExtensionTools(extension)"
                            :key="tool.id"
                            class="tool-item"
                            :style="{ transitionDelay: `${toolIndex * 30}ms` }"
                          >
                            <v-sheet
                              class="tool-icon-wrapper"
                              rounded="circle"
                            >
                              <v-icon
                                v-if="tool.iconType === 'mdi'"
                                :icon="tool.iconSource"
                                size="20"
                              />
                              <v-img
                                v-else-if="tool.iconType === 'svg'"
                                :src="tool.iconSource"
                                width="20"
                                height="20"
                                contain
                              />
                            </v-sheet>

                            <div class="tool-content">
                              <div class="tool-title">
                                {{ tool.title }}
                              </div>

                              <div class="tool-description">
                                {{ tool.description }}
                              </div>
                            </div>
                          </div>
                        </v-fade-transition>
                      </div>

                      <v-alert
                        v-else
                        type="info"
                        variant="tonal"
                        rounded="lg"
                        class="empty-tools-alert"
                      >
                        <template #prepend>
                          <v-icon>mdi-information</v-icon>
                        </template>
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
          class="mt-8 empty-state"
        >
          <v-card-text class="text-center pa-8">
            <v-sheet
              class="empty-icon-wrapper mx-auto mb-4"
              rounded="circle"
            >
              <v-icon icon="mdi-puzzle-outline" size="64" />
            </v-sheet>
            <div class="empty-title mb-2">
              No extensions loaded yet
            </div>
            <div class="empty-subtitle">
              Upload an extension file to get started
            </div>
          </v-card-text>
        </v-card>
      </v-fade-transition>
    </v-card-text>

    <!-- Dialog Remove -->
    <v-dialog v-model="showRemoveDialog" max-width="450">
      <v-card rounded="xl" class="remove-dialog">
        <v-card-title class="dialog-title">
          <v-icon icon="mdi-alert" class="mr-3 warning-icon" />
          Remove Extension?
        </v-card-title>

        <v-card-text class="dialog-text">
          Are you sure you want to remove <strong>{{ getExtensionName(extensionToRemove) }}</strong>?
          <div class="mt-2 text-caption text-medium-emphasis">
            This will remove all tools registered by this extension.
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showRemoveDialog = false" class="cancel-btn">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" @click="removeExtension" class="remove-confirm-btn">
            <v-icon start>mdi-delete</v-icon>
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

const handleFileChange = async (event) => {
  const newFiles = event.target?.files
  if (!newFiles?.length) return
  await processFiles([...newFiles])
  // Reset input so the same file can be selected again
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
    // For dates older than a year, show the actual date
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
/* Container */
.extension-container {
  background: #ffffff;
}

/* Drop Zone */
.drop-zone-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fafafa;
  border: 2px dashed #e0e0e0;
}

.drop-zone-hover {
  transform: translateY(-2px);
  border-color: rgb(var(--v-theme-primary));
  background: #f5f9ff;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
}

.drop-zone-loading {
  pointer-events: none;
  opacity: 0.6;
}

/* Icon Wrapper */
.icon-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  transition: all 0.3s ease;
}

.icon-active {
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.icon-wrapper .v-icon {
  color: #757575;
  transition: color 0.3s ease;
}

.icon-active .v-icon {
  color: white;
}

/* Drop Zone Text */
.drop-zone-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #424242;
  transition: color 0.3s ease;
}

.drop-zone-hover .drop-zone-title {
  color: rgb(var(--v-theme-primary));
}

.drop-zone-subtitle {
  font-size: 0.875rem;
  color: #757575;
}

/* Rotating Animation */
.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Alerts */
.alert-animated {
  animation: slide-in 0.3s ease;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section Header */
.section-header {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
}

.count-chip {
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.15);
}

/* Extension Panels */
.extension-panels {
  background: transparent !important;
}

.extension-panel {
  transition: box-shadow 0.3s ease;
  overflow: hidden;
  background: white;
  border: 1px solid #e0e0e0;
}

.extension-panel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.extension-panel-title {
  padding: 20px;
}

/* Extension Header */
.extension-header {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.extension-header-expanded {
  background: #f5f9ff;
  border-radius: 8px;
  padding: 8px;
  margin: -8px;
}

/* Extension Icon */
.extension-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.extension-icon-active {
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.extension-icon .v-icon {
  color: #757575;
  transition: color 0.3s ease;
}

.extension-icon-active .v-icon {
  color: white;
}

/* Extension Info */
.extension-info {
  flex: 1;
  min-width: 0;
}

.extension-name {
  font-size: 1rem;
  font-weight: 600;
  color: #212121;
  margin-bottom: 4px;
}

.extension-description {
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 8px;
  line-height: 1.5;
  white-space: normal;
  word-wrap: break-word;
}

.extension-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.status-chip {
  box-shadow: 0 1px 3px rgba(76, 175, 80, 0.15);
}

.tools-chip {
  box-shadow: 0 1px 3px rgba(33, 150, 243, 0.15);
}

.extension-date {
  font-size: 0.75rem;
  color: #9e9e9e;
  white-space: nowrap;
}

/* Remove Button */
.remove-btn {
  transition: all 0.2s ease;
  opacity: 0.7;
}

.remove-btn:hover {
  opacity: 1;
  background-color: rgba(244, 67, 54, 0.08);
}

/* Extension Panel Content */
.extension-panel-content {
  padding: 0 24px 24px 24px;
}

.divider-gradient {
  background: #e0e0e0;
  height: 1px;
  border: none;
}

/* Tools Section */
.tools-section-header {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #424242;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tools-list {
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  transition: all 0.2s ease;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.tool-item:hover {
  background: #f5f9ff;
  border-color: rgba(33, 150, 243, 0.3);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
}

.tool-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f2fd;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.tool-item:hover .tool-icon-wrapper {
  background: rgb(var(--v-theme-primary));
}

.tool-icon-wrapper .v-icon {
  color: rgb(var(--v-theme-primary));
  transition: color 0.2s ease;
}

.tool-item:hover .tool-icon-wrapper .v-icon {
  color: white;
}

.tool-content {
  flex: 1;
  min-width: 0;
}

.tool-title {
  font-weight: 600;
  color: #212121;
  font-size: 0.9375rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

.tool-description {
  font-size: 0.8125rem;
  color: #757575;
  line-height: 1.5;
}

.empty-tools-alert {
  margin-top: 8px;
}

/* Empty State */
.empty-state {
  border: 2px dashed #e0e0e0;
  background: #fafafa;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  margin: 0 auto;
}

.empty-icon-wrapper .v-icon {
  color: #bdbdbd;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: #424242;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #757575;
}

/* Remove Dialog */
.remove-dialog {
  overflow: hidden;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f57c00;
  padding: 24px 24px 16px 24px;
  display: flex;
  align-items: center;
}

.dialog-text {
  padding: 0 24px 24px 24px;
  font-size: 0.9375rem;
  color: #424242;
  line-height: 1.6;
}

.cancel-btn {
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.remove-confirm-btn {
  transition: all 0.2s ease;
}

.remove-confirm-btn:hover {
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
}

/* Utility */
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

/* Responsive */
@media (max-width: 600px) {
  .extension-icon {
    width: 48px;
    height: 48px;
  }
  
  .extension-icon .v-icon {
    font-size: 24px;
  }
  
  .extension-name {
    font-size: 0.9375rem;
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
  }
}
</style>
