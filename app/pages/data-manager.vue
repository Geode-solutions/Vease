<template>
  <v-container fluid class="pa-0 fill-height bg-grey-darken-4">
    <v-row no-gutters class="fill-height">
      <!-- Sidebar: Folders & Import Queue -->
      <v-col cols="12" md="3" lg="2" class="border-e border-opacity-10 bg-black-opacity-20 d-flex flex-column">
        <div class="pa-4 flex-grow-1 overflow-y-auto">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-white font-weight-light">Folders</h3>
            <v-btn icon="mdi-folder-plus" size="x-small" variant="text" color="white" @click="showNewFolderDialog = true" />
          </div>

          <v-list bg-color="transparent" density="compact" nav>
            <v-list-item
              prepend-icon="mdi-folder-outline"
              title="All Data"
              :active="!selectedFolderId"
              @click="selectedFolderId = null"
              class="text-white"
            />
            <v-list-item
              v-for="folder in folders"
              :key="folder.id"
              prepend-icon="mdi-folder"
              :title="folder.name"
              :active="selectedFolderId === folder.id"
              @click="selectedFolderId = folder.id"
              class="text-white"
            >
              <template v-slot:append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" size="x-small" variant="text" v-bind="props" />
                  </template>
                  <v-list density="compact">
                    <v-list-item prepend-icon="mdi-pencil" title="Rename" @click="editFolder(folder)" />
                    <v-list-item prepend-icon="mdi-delete" title="Delete" base-color="error" @click="confirmDeleteFolder(folder)" />
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <!-- Import Queue Section -->
        <div v-if="importQueue.length > 0" class="border-t border-opacity-10 pa-4 bg-black-opacity-10">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption text-grey">Import Queue</span>
            <v-btn v-if="hasCompletedImports" variant="text" size="x-small" color="grey" @click="clearCompletedImports">Clear</v-btn>
          </div>
          <div class="ga-2 d-flex flex-column">
            <div v-for="item in importQueue" :key="item.id" class="bg-white-opacity-5 rounded pa-2">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-caption text-truncate text-white" style="max-width: 120px">{{ item.name }}</span>
                <v-icon v-if="item.status === 'success'" icon="mdi-check-circle" color="success" size="14" />
                <v-icon v-else-if="item.status === 'error'" icon="mdi-alert-circle" color="error" size="14" />
                <v-progress-circular v-else indeterminate size="14" width="2" color="primary" />
              </div>
              <v-progress-linear
                v-if="item.status === 'importing'"
                :model-value="item.progress"
                height="2"
                color="primary"
                rounded
              />
              <div v-if="item.error" class="text-caption text-error text-truncate" :title="item.error">
                {{ item.error }}
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Main Content Area -->
      <v-col class="d-flex flex-column fill-height overflow-hidden">
        <!-- Header & Controls -->
        <div class="pa-4 border-b border-opacity-10 bg-black-opacity-10">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center ga-4">
              <h2 class="text-h5 text-white font-weight-light">Data Manager</h2>
              <v-btn icon="mdi-refresh" size="small" variant="text" color="white" @click="loadData" :loading="loading" />
            </div>
            
            <div class="d-flex align-center ga-2">
              <v-btn-toggle v-model="viewMode" mandatory density="compact" theme="dark" variant="outlined" divided>
                <v-btn value="list" icon="mdi-view-list" size="small" />
                <v-btn value="grid" icon="mdi-view-grid" size="small" />
              </v-btn-toggle>
              
              <v-btn
                prepend-icon="mdi-upload"
                color="primary"
                variant="flat"
                @click="triggerFileInput"
              >
                Import Data
              </v-btn>
            </div>
          </div>

          <div class="d-flex flex-wrap ga-4 align-center">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search data... (Ctrl+F)"
              variant="solo"
              density="compact"
              hide-details
              class="rounded-lg"
              clearable
              style="max-width: 300px; background: rgba(255, 255, 255, 0.1)"
              ref="searchInput"
            />
            
            <v-select
              v-model="filterType"
              :items="availableTypes"
              label="Type"
              variant="solo"
              density="compact"
              hide-details
              multiple
              chips
              closable-chips
              style="max-width: 250px; background: rgba(255, 255, 255, 0.1)"
            />

            <v-select
              v-model="filterTags"
              :items="availableTags"
              label="Tags"
              variant="solo"
              density="compact"
              hide-details
              multiple
              chips
              closable-chips
              style="max-width: 250px; background: rgba(255, 255, 255, 0.1)"
            />
          </div>
        </div>

        <!-- Data Display Area -->
        <div class="flex-grow-1 overflow-y-auto pa-4" @dragover.prevent @drop="onDrop">
          <!-- Batch Actions Toolbar -->
          <v-expand-transition>
            <div v-if="selected.length > 0" class="mb-4 pa-2 bg-primary-opacity-10 rounded-lg border border-primary border-opacity-20 d-flex align-center justify-space-between">
              <div class="d-flex align-center ga-2">
                <span class="text-subtitle-2 text-white px-2">{{ selected.length }} items selected</span>
                <v-divider vertical class="mx-2" />
                <v-btn prepend-icon="mdi-tag-multiple" size="small" variant="text" color="white" @click="showBatchTagDialog = true">Tag</v-btn>
                <v-btn prepend-icon="mdi-folder-move" size="small" variant="text" color="white" @click="showBatchMoveDialog = true">Move</v-btn>
                <v-btn prepend-icon="mdi-palette" size="small" variant="text" color="white" @click="showBatchColorDialog = true">Color</v-btn>
                <v-btn prepend-icon="mdi-export" size="small" variant="text" color="white" @click="exportSelected">Export</v-btn>
                <v-btn prepend-icon="mdi-delete" size="small" variant="text" color="error" @click="deleteSelectedDialog = true">Delete</v-btn>
              </div>
              <v-btn icon="mdi-close" size="x-small" variant="text" color="white" @click="selected = []" />
            </div>
          </v-expand-transition>

          <!-- List View -->
          <v-data-table
            v-if="viewMode === 'list'"
            v-model="selected"
            :headers="headers"
            :items="filteredItems"
            :search="search"
            show-select
            theme="dark"
            class="bg-transparent"
            hover
          >
            <!-- Custom Item Rendering -->
            <template v-slot:item.displayed_name="{ item }">
              <div class="d-flex align-center ga-2 py-2">
                <v-icon :icon="item.pinned ? 'mdi-pin' : 'mdi-pin-outline'" 
                        :color="item.pinned ? 'primary' : 'grey'" 
                        size="small" 
                        class="cursor-pointer"
                        @click.stop="togglePin(item)" />
                <span class="font-weight-medium">{{ item.displayed_name }}</span>
              </div>
            </template>

            <template v-slot:item.geode_object="{ item }">
              <div class="d-flex flex-column">
                <v-chip size="x-small" color="primary" variant="flat" class="mb-1">{{ item.geode_object }}</v-chip>
                <span class="text-caption text-grey">{{ getItemMetadata(item) }}</span>
              </div>
            </template>

            <template v-slot:item.created_at="{ item }">
              <span class="text-caption text-grey">{{ formatDate(item.created_at) }}</span>
            </template>

            <template v-slot:item.visible="{ item }">
              <v-btn
                :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
                size="small"
                variant="text"
                :color="item.visible ? 'white' : 'grey'"
                @click.stop="toggleVisibility(item)"
              />
            </template>

            <template v-slot:item.color="{ item }">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props" size="x-small">
                    <v-icon icon="mdi-circle" :color="getItemColor(item)" />
                  </v-btn>
                </template>
                <v-color-picker
                  :model-value="getItemColor(item)"
                  @update:model-value="(val) => updateItemColor(item, val)"
                  hide-inputs
                  show-swatches
                />
              </v-menu>
            </template>

            <template v-slot:item.tags="{ item }">
              <div class="d-flex flex-wrap ga-1 align-center">
                <v-chip
                  v-for="tag in item.tags"
                  :key="tag"
                  size="x-small"
                  closable
                  color="secondary"
                  variant="flat"
                  @click:close="removeTag(item, tag)"
                >
                  {{ tag }}
                </v-chip>
                <v-btn icon="mdi-plus" size="x-small" variant="text" color="white" @click="showAddTagDialog(item)" />
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-1">
                <v-tooltip text="Focus Camera">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-target" size="small" variant="text" color="white" v-bind="props" @click.stop="focusCamera(item)" />
                  </template>
                </v-tooltip>
                <v-tooltip text="Isolate">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-filter-variant" size="small" variant="text" color="white" v-bind="props" @click.stop="isolateItem(item)" />
                  </template>
                </v-tooltip>
                <v-tooltip text="Delete">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" v-bind="props" @click.stop="confirmDelete(item)" />
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-12">
                <v-icon size="80" color="white" class="mb-4 opacity-50">mdi-database-search-outline</v-icon>
                <p class="text-h5 text-white font-weight-light">No data found</p>
                <p class="text-body-1 text-white opacity-70">Try adjusting your search or import new models</p>
                <v-btn v-if="search" variant="text" color="white" class="mt-4" @click="search = ''">Clear Search</v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Grid View -->
          <v-row v-else class="mt-2">
            <v-col v-for="item in filteredItems" :key="item.id" cols="12" sm="6" md="4" lg="3">
              <v-card class="glass-card h-100 d-flex flex-column position-relative" :class="{ 'border-primary': selected.includes(item) }">
                <div class="position-absolute top-0 right-0 pa-2 z-index-1">
                  <v-checkbox-btn v-model="selected" :value="item" color="primary" density="compact" />
                </div>
                
                <v-card-text class="pa-4">
                  <div class="d-flex align-center ga-2 mb-2">
                    <v-icon :icon="item.pinned ? 'mdi-pin' : 'mdi-pin-outline'" 
                            :color="item.pinned ? 'primary' : 'grey'" 
                            size="small" 
                            @click.stop="togglePin(item)" />
                    <span class="text-subtitle-1 text-white font-weight-bold text-truncate">{{ item.displayed_name }}</span>
                  </div>
                  
                  <div class="d-flex align-center ga-2 mb-4">
                    <v-chip size="x-small" color="primary" variant="flat">{{ item.geode_object }}</v-chip>
                    <v-icon icon="mdi-circle" :color="getItemColor(item)" size="xs" />
                  </div>

                  <div class="text-caption text-grey mb-4">
                    {{ getItemMetadata(item) }}
                  </div>

                  <div class="d-flex flex-wrap ga-1 mb-4">
                    <v-chip v-for="tag in item.tags" :key="tag" size="x-small" color="secondary" variant="flat">{{ tag }}</v-chip>
                  </div>
                </v-card-text>

                <v-divider class="opacity-10" />

                <v-card-actions class="pa-2 bg-black-opacity-10">
                  <v-btn :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'" size="small" variant="text" :color="item.visible ? 'white' : 'grey'" @click.stop="toggleVisibility(item)" />
                  <v-spacer />
                  <v-btn icon="mdi-target" size="small" variant="text" color="white" @click.stop="focusCamera(item)" />
                  <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click.stop="confirmDelete(item)" />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog v-model="showNewFolderDialog" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">New Folder</v-card-title>
        <v-card-text>
          <v-text-field v-model="newFolderName" label="Folder Name" variant="solo" hide-details bg-color="rgba(255,255,255,0.1)" @keyup.enter="createNewFolder" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="showNewFolderDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="createNewFolder">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteSelectedDialog" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">Delete Selected Items?</v-card-title>
        <v-card-text class="text-white opacity-70">This will permanently remove {{ selected.length }} items.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="deleteSelectedDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteSelected">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBatchTagDialog" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">Add Tags to Selected</v-card-title>
        <v-card-text>
          <v-combobox v-model="batchTags" label="Tags" multiple chips variant="solo" bg-color="rgba(255,255,255,0.1)" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="showBatchTagDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="applyBatchTags">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBatchMoveDialog" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">Move Selected to Folder</v-card-title>
        <v-card-text>
          <v-select v-model="batchFolderId" :items="folders" item-title="name" item-value="id" label="Folder" variant="solo" bg-color="rgba(255,255,255,0.1)" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="showBatchMoveDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="applyBatchMove">Move</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBatchColorDialog" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">Update Color for Selected</v-card-title>
        <v-card-text class="d-flex justify-center">
          <v-color-picker v-model="batchColor" hide-inputs show-swatches />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="showBatchColorDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="applyBatchColor">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddTagDialogSingle" max-width="400">
      <v-card class="glass-card">
        <v-card-title class="text-white">Add Tag</v-card-title>
        <v-card-text>
          <v-combobox v-model="newTag" label="Tag" variant="solo" bg-color="rgba(255,255,255,0.1)" @keyup.enter="applyAddTag" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="white" @click="showAddTagDialogSingle = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="applyAddTag">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      {{ snackbar.text }}
    </v-snackbar>

    <input type="file" ref="fileInput" style="display: none" multiple @change="onFileSelected" />
  </v-container>
</template>

<script setup>
  import { useDataBaseStore } from "@ogw_front/stores/data_base"
  import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
  import { useImportQueueStore } from "@ogw_front/stores/import_queue"
  import { useTreeviewStore } from "@ogw_front/stores/treeview"
  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useProjectManager } from "@ogw_front/composables/project_manager"
  import { useFileImportWorkflow } from "@vease/composables/file_import_workflow"
  import { useMagicKeys, whenever } from "@vueuse/core"

  const dataBaseStore = useDataBaseStore()
  const hybridViewerStore = useHybridViewerStore()
  const importQueueStore = useImportQueueStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()
  const { handleFileImport } = useFileImportWorkflow()

  const loading = ref(false)
  const search = ref("")
  const viewMode = ref("list")
  const selected = ref([])
  const items = ref([])
  const folders = ref([])
  const selectedFolderId = ref(null)
  const filterType = ref([])
  const filterTags = ref([])

  const showNewFolderDialog = ref(false)
  const newFolderName = ref("")
  const deleteSelectedDialog = ref(false)
  const showBatchTagDialog = ref(false)
  const batchTags = ref([])
  const showBatchMoveDialog = ref(false)
  const batchFolderId = ref(null)
  const showBatchColorDialog = ref(false)
  const batchColor = ref("#FFFFFF")
  const showAddTagDialogSingle = ref(false)
  const newTag = ref("")
  const currentItemForTag = ref(null)

  const snackbar = reactive({ show: false, text: "", color: "success" })
  const fileInput = useTemplateRef("fileInput")
  const searchInput = useTemplateRef("searchInput")

  const importQueue = computed(() => importQueueStore.queue)
  const hasCompletedImports = computed(() => importQueue.value.some(i => i.status === 'success' || i.status === 'error'))

  const headers = [
    { title: "Name", key: "displayed_name", sortable: true },
    { title: "Type", key: "geode_object", sortable: true },
    { title: "Tags", key: "tags", sortable: false },
    { title: "Date", key: "created_at", sortable: true },
    { title: "Visibility", key: "visible", sortable: false, align: "center" },
    { title: "Color", key: "color", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "end" },
  ]

  const availableTypes = computed(() => [...new Set(items.value.map(i => i.geode_object))])
  const availableTags = computed(() => [...new Set(items.value.flatMap(i => i.tags || []))])

  const filteredItems = computed(() => {
    let result = items.value

    if (selectedFolderId.value) {
      result = result.filter(i => i.folder_id === selectedFolderId.value)
    }

    if (filterType.value.length > 0) {
      result = result.filter(i => filterType.value.includes(i.geode_object))
    }

    if (filterTags.value.length > 0) {
      result = result.filter(i => (i.tags || []).some(t => filterTags.value.includes(t)))
    }

    // Sort pinned to top
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.created_at) - new Date(a.created_at)
    })
  })

  async function loadData() {
    loading.value = true
    try {
      items.value = await dataBaseStore.getAllItems()
      folders.value = await dataBaseStore.getAllFolders()
    } finally {
      loading.value = false
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString()
  }

  function getItemColor(item) {
    return dataStyleStore.styles[item.id]?.color || "#FFFFFF"
  }

  async function updateItemColor(item, color) {
    await dataStyleStore.updateStyle(item.id, { color })
  }

  async function toggleVisibility(item) {
    const newVisible = !item.visible
    await dataBaseStore.updateItem(item.id, { visible: newVisible })
    await dataStyleStore.setVisibility(item.id, newVisible)
    item.visible = newVisible
  }

  async function togglePin(item) {
    await dataBaseStore.togglePin(item.id)
    item.pinned = !item.pinned
  }

  function getItemMetadata(item) {
    const viewerData = hybridViewerStore.db[item.id]
    if (!viewerData || !viewerData.polydata) return ""
    
    const pts = viewerData.polydata.getNumberOfPoints()
    const cells = viewerData.polydata.getNumberOfCells()
    
    let meta = `${pts.toLocaleString()} pts | ${cells.toLocaleString()} cells`
    
    const bounds = viewerData.polydata.getBounds()
    if (bounds && bounds.length === 6) {
      const dx = Math.round((bounds[1] - bounds[0]) * 100) / 100
      const dy = Math.round((bounds[3] - bounds[2]) * 100) / 100
      const dz = Math.round((bounds[5] - bounds[4]) * 100) / 100
      meta += ` | Box: ${dx}x${dy}x${dz}`
    }
    
    return meta
  }

  async function focusCamera(item) {
    const viewerData = hybridViewerStore.db[item.id]
    if (viewerData && viewerData.actor) {
      const renderer = hybridViewerStore.genericRenderWindow.getRenderer()
      renderer.resetCamera(viewerData.actor.getBounds())
      hybridViewerStore.genericRenderWindow.getRenderWindow().render()
      hybridViewerStore.syncRemoteCamera()
    }
  }

  async function isolateItem(item) {
    for (const i of items.value) {
      const visible = i.id === item.id
      await dataBaseStore.updateItem(i.id, { visible })
      await dataStyleStore.setVisibility(i.id, visible)
      i.visible = visible
    }
  }

  async function confirmDelete(item) {
    if (confirm(`Delete "${item.displayed_name}"?`)) {
      await dataBaseStore.deleteItem(item.id)
      await hybridViewerStore.removeItem(item.id)
      treeviewStore.removeItem(item.id)
      items.value = items.value.filter(i => i.id !== item.id)
      showFeedback("Item deleted")
    }
  }

  async function deleteSelected() {
    for (const item of selected.value) {
      await dataBaseStore.deleteItem(item.id)
      await hybridViewerStore.removeItem(item.id)
      treeviewStore.removeItem(item.id)
    }
    items.value = items.value.filter(i => !selected.value.includes(i))
    selected.value = []
    deleteSelectedDialog.value = false
    showFeedback("Selected items deleted")
  }

  async function createNewFolder() {
    if (newFolderName.value) {
      const folder = await dataBaseStore.createFolder(newFolderName.value)
      folders.value.push(folder)
      newFolderName.value = ""
      showNewFolderDialog.value = false
      showFeedback("Folder created")
    }
  }

  async function applyBatchTags() {
    const ids = selected.value.map(i => i.id)
    await dataBaseStore.batchAddTags(ids, batchTags.value)
    await loadData()
    batchTags.value = []
    showBatchTagDialog.value = false
    showFeedback("Tags applied")
  }

  async function applyBatchMove() {
    const ids = selected.value.map(i => i.id)
    await dataBaseStore.batchMoveToFolder(ids, batchFolderId.value)
    await loadData()
    showBatchMoveDialog.value = false
    showFeedback("Items moved")
  }

  async function applyBatchColor() {
    const ids = selected.value.map(i => i.id)
    await dataBaseStore.batchUpdateColor(ids, batchColor.value)
    showBatchColorDialog.value = false
    showFeedback("Colors updated")
  }

  function showAddTagDialog(item) {
    currentItemForTag.value = item
    showAddTagDialogSingle.value = true
  }

  async function applyAddTag() {
    if (newTag.value && currentItemForTag.value) {
      await dataBaseStore.addTag(currentItemForTag.value.id, newTag.value)
      await loadData()
      newTag.value = ""
      showAddTagDialogSingle.value = false
    }
  }

  async function removeTag(item, tag) {
    await dataBaseStore.removeTag(item.id, tag)
    await loadData()
  }

  async function exportSelected() {
    const { exportProject } = useProjectManager()
    showFeedback(`Exporting ${selected.value.length} items...`)
    try {
      await exportProject({ itemIds: selected.value.map(i => i.id) })
      showFeedback("Export successful")
    } catch (error) {
      console.error("Export failed:", error)
      showFeedback("Export failed", "error")
    }
  }

  function triggerFileInput() {
    fileInput.value?.click()
  }

  async function onFileSelected(event) {
    const files = event.target.files
    if (files.length > 0) {
      for (const file of files) {
        // We need geode_object here, for now assuming it's a generic one or we'd need a picker
        // In a real scenario, we might want to show a dialog to pick the type if it's not obvious
        await handleFileImport(file, "BRep") // Defaulting to BRep for now as example
      }
      await loadData()
    }
  }

  async function onDrop(event) {
    const files = event.dataTransfer.files
    if (files.length > 0) {
      for (const file of files) {
        await handleFileImport(file, "BRep")
      }
      await loadData()
    }
  }

  function clearCompletedImports() {
    importQueueStore.clearCompleted()
  }

  function showFeedback(text, color = "success") {
    snackbar.text = text
    snackbar.color = color
    snackbar.show = true
  }

  // Keyboard Shortcuts
  const { delete: del, control_f, space } = useMagicKeys()
  
  whenever(del, () => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return
    if (selected.value.length > 0) deleteSelectedDialog.value = true
  })
  
  whenever(control_f, (e) => {
    e.preventDefault()
    searchInput.value?.focus()
  })
  
  whenever(space, () => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return
    if (selected.value.length > 0) {
      const allVisible = selected.value.every(i => i.visible)
      selected.value.forEach(async i => {
        await dataBaseStore.updateItem(i.id, { visible: !allVisible })
        await dataStyleStore.setVisibility(i.id, !allVisible)
        i.visible = !allVisible
      })
    }
  })

  onMounted(loadData)
</script>

<style scoped>
  .glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .bg-black-opacity-20 {
    background: rgba(0, 0, 0, 0.2);
  }
  .bg-black-opacity-10 {
    background: rgba(0, 0, 0, 0.1);
  }
  .bg-white-opacity-5 {
    background: rgba(255, 255, 255, 0.05);
  }
  .bg-primary-opacity-10 {
    background: rgba(var(--v-theme-primary), 0.1);
  }
  .z-index-1 {
    z-index: 1;
  }
</style>
