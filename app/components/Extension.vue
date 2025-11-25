<template>
  <v-card class="extension-manager-card" flat>
    <v-card-title class="extension-manager-header">
      <v-icon icon="mdi-puzzle" class="extension-manager-icon" />
      Extensions
    </v-card-title>
    <v-card-subtitle class="extension-manager-subtitle">
      Enhance your application with additional features and tools
    </v-card-subtitle>

    <v-card-text class="extension-manager-content">
      <!-- Drag & Drop Zone -->
      <v-card
        class="extension-upload-card"
        :class="{
          'extension-upload-hover': isDragging,
          'extension-upload-loading': loading,
        }"
        :elevation="isDragging ? 8 : 2"
        rounded="lg"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <v-card-text class="extension-upload-content">
          <v-icon
            :icon="loading ? 'mdi-loading' : 'mdi-cloud-upload'"
            :class="{ 'rotating': loading }"
            size="64"
            :color="isDragging ? 'primary' : 'grey-lighten-1'"
            class="mb-4"
          />
          <div class="extension-upload-text" :class="isDragging ? 'text-primary' : ''">
            {{ loading ? 'Loading Extension...' : isDragging ? 'Drop to Install' : 'Drag & Drop Extension' }}
          </div>
          <div class="extension-upload-hint">
            or click to browse files
          </div>
          <v-file-input
            v-model="files"
            accept=".es.js"
            multiple
            class="file-input-hidden"
            @update:model-value="handleFileChange"
            hide-details
            density="compact"
          >
            <template v-slot:prepend>
              <v-btn
                color="primary"
                variant="outlined"
                rounded="pill"
                :loading="loading"
                class="extension-upload-button"
              >
                <v-icon start>mdi-folder-open</v-icon>
                Browse Files
              </v-btn>
            </template>
          </v-file-input>
        </v-card-text>
      </v-card>

      <!-- Success/Error Messages -->
      <v-expand-transition>
        <v-alert
          v-if="successMessage"
          type="success"
          class="extension-alert mt-4"
          closable
          @click:close="successMessage = ''"
        >
          <div class="d-flex align-center">
            <v-icon start>mdi-check-circle</v-icon>
            {{ successMessage }}
          </div>
        </v-alert>
      </v-expand-transition>

      <v-expand-transition>
        <v-alert
          v-if="errorMessage"
          type="error"
          class="extension-alert mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          <div class="d-flex align-center">
            <v-icon start>mdi-alert-circle</v-icon>
            {{ errorMessage }}
          </div>
        </v-alert>
      </v-expand-transition>

      <!-- Loaded Extensions -->
      <div v-if="loadedExtensions.length > 0" class="mt-6">
        <div class="extension-header">
          <v-icon icon="mdi-puzzle-check" color="success" class="mr-2" />
          Active Extensions
          <v-chip size="small" class="ml-2" color="success" variant="tonal">
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
                rounded="lg"
                class="extension-item-card"
                :class="{ 'extension-item-hover': isHovering }"
              >
                <v-card-text class="pa-4">
                  <div class="extension-item-content">
                    <v-avatar
                      :color="isHovering ? 'primary' : 'grey-lighten-3'"
                      size="48"
                      class="mr-3"
                    >
                      <v-icon
                        :color="isHovering ? 'white' : 'grey-darken-2'"
                        icon="mdi-puzzle"
                      />
                    </v-avatar>
                    <div class="extension-item-details">
                      <div class="extension-item-title">
                        {{ getExtensionName(extension) }}
                      </div>
                      <div class="extension-item-description">
                        {{ getExtensionDescription(extension) }}
                      </div>
                      <div class="extension-item-meta">
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
                          variant="tonal"
                        >
                          v{{ getExtensionVersion(extension) }}
                        </v-chip>
                        <v-spacer />
                        <span class="extension-item-date">
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
                      class="extension-item-remove"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>

      <!-- Empty State -->
      <v-card
        v-if="loadedExtensions.length === 0"
        variant="outlined"
        rounded="lg"
        class="mt-6 empty-state-card"
      >
        <v-card-text class="text-center pa-6">
          <v-icon
            icon="mdi-puzzle-outline"
            size="48"
            color="grey-lighten-1"
            class="mb-3"
          />
          <div class="empty-state-title">
            No extensions loaded yet
          </div>
          <div class="empty-state-description">
            Upload an extension file to get started
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showRemoveDialog" max-width="400">
      <v-card rounded="lg" class="extension-confirmation-dialog">
        <v-card-title class="extension-confirmation-header">
          <v-icon icon="mdi-alert" color="warning" class="mr-2" />
          Remove Extension?
        </v-card-title>
        <v-card-text class="extension-confirmation-content">
          Are you sure you want to remove <strong>{{ getExtensionName(extensionToRemove) }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions class="extension-confirmation-actions">
          <v-spacer />
          <v-btn
            variant="text"
            @click="showRemoveDialog = false"
            class="extension-confirmation-cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="removeExtension"
            class="extension-confirmation-remove"
          >
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
const loading = ref(false)
const isDragging = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showRemoveDialog = ref(false)
const extensionToRemove = ref(null)

const loadedExtensions = computed(() => appStore.getLoadedExtensions())

// Extract extension name from path or metadata
const getExtensionName = (extension) => {
  if (!extension) return 'Unknown Extension'

  // Try to get name from metadata first
  if (extension.metadata?.name) {
    return extension.metadata.name
  }

  // Extract filename from path
  const path = extension.path || ''
  const filename = path.split('/').pop() || path

  // Remove .es.js extension and format nicely
  return filename
    .replace(/\.es\.js$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get extension description
const getExtensionDescription = (extension) => {
  if (extension?.metadata?.description) {
    return extension.metadata.description
  }
  return 'Custom extension module'
}

// Get extension version
const getExtensionVersion = (extension) => {
  return extension?.metadata?.version || null
}

const handleDrop = async (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files).filter(
    file => file.name.endsWith('.es.js')
  )

  if (droppedFiles.length === 0) {
    errorMessage.value = 'Please drop valid extension files (.es.js)'
    return
  }

  await processFiles(droppedFiles)
}

const handleFileChange = async (newFiles) => {
  if (!newFiles || newFiles.length === 0) return
  await processFiles(newFiles)
}

const processFiles = async (filesToProcess) => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  let successCount = 0
  let failCount = 0

  try {
    for (const file of filesToProcess) {
      const fileURL = URL.createObjectURL(file)

      try {
        await appStore.loadExtension(fileURL)
        successCount++
        console.log(`Extension loaded successfully: ${file.name}`)
      } catch (error) {
        failCount++
        console.error(`Failed to load extension ${file.name}:`, error)
        errorMessage.value = `Failed to load ${file.name}: ${error.message}`
      } finally {
        URL.revokeObjectURL(fileURL)
      }
    }

    if (successCount > 0) {
      successMessage.value = `Successfully loaded ${successCount} extension${successCount > 1 ? 's' : ''}!`
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
  } finally {
    loading.value = false
    files.value = []
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`

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
/* Main Card */
.extension-manager-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.extension-manager-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

/* Header Styles */
.extension-manager-header {
  padding: 24px 24px 0 24px !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  border-radius: 12px 12px 0 0 !important;
  color: rgba(var(--v-theme-primary), 1);
}

.extension-manager-icon {
  margin-right: 12px;
  font-size: 28px;
}

.extension-manager-subtitle {
  padding: 0 24px 16px 24px !important;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Upload Card Styles */
.extension-upload-card {
  transition: all 0.3s ease;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.02);
  cursor: pointer;
  margin-bottom: 24px;
}

.extension-upload-hover {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
  transform: scale(1.02);
}

.extension-upload-loading {
  pointer-events: none;
  opacity: 0.7;
}

.extension-upload-content {
  text-align: center;
  padding: 32px !important;
}

.extension-upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.extension-upload-hint {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.extension-upload-button {
  margin-top: 8px;
}

/* Alert Styles */
.extension-alert {
  border-radius: 8px;
}

/* Extension List Styles */
.extension-header {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

/* Extension Item Styles */
.extension-item-card {
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
  margin-bottom: 12px;
}

.extension-item-hover {
  transform: translateX(4px);
  border-left-color: rgb(var(--v-theme-primary));
}

.extension-item-content {
  display: flex;
  align-items: flex-start;
}

.extension-item-details {
  flex-grow: 1;
}

.extension-item-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.extension-item-description {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 8px;
}

.extension-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.extension-item-date {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.extension-item-remove {
  margin-left: 8px;
}

/* Empty State Styles */
.empty-state-card {
  border-style: dashed;
  border-color: rgba(var(--v-theme-on-surface), 0.12);
}

.empty-state-title {
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin-bottom: 4px;
}

.empty-state-description {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Confirmation Dialog Styles */
.extension-confirmation-dialog {
  border-radius: 12px;
}

.extension-confirmation-header {
  padding: 20px !important;
  background: rgba(var(--v-theme-error), 0.1);
  color: rgba(var(--v-theme-on-error), 0.9);
}

.extension-confirmation-content {
  padding: 16px 24px !important;
}

.extension-confirmation-actions {
  padding: 16px 24px !important;
}

.extension-confirmation-cancel {
  min-width: 80px;
}

.extension-confirmation-remove {
  min-width: 80px;
}

.file-input-hidden :deep(.v-input__control) {
  display: none;
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
