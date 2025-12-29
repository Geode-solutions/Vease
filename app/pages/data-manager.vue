<template>
  <v-card
    class="bg-primary"
    style="
      height: 100%;
      width: 100%;
      overflow-y: auto;
      max-height: calc(100vh - 75px);
      border-radius: 10px;
    "
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-database" color="white" size="large" class="mr-3" />
            <p class="text-h4 text-white mb-0">Data Manager</p>
            <v-spacer />
            <v-btn
              icon="mdi-refresh"
              variant="text"
              color="white"
              @click="loadData"
              class="mr-2"
              v-tooltip.bottom="'Refresh data'"
            />
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search data..."
              variant="solo"
              density="compact"
              hide-details
              class="search-bar"
              clearable
            />
          </div>
          <v-divider class="mb-4" style="opacity: 0.2" />

          <v-tabs v-model="activeTab" bg-color="transparent" color="white">
            <v-tab value="imported">Imported Data</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="imported">
              <v-card class="bg-transparent" elevation="0">
                <v-card-text>
                  <v-row class="mb-4" align="center">
                    <v-col cols="auto">
                      <v-fade-transition>
                        <v-chip
                          v-if="selected.length > 0"
                          color="white"
                          variant="elevated"
                          class="font-weight-bold"
                          closable
                          @click:close="selected = []"
                        >
                          {{ selected.length }} items selected
                        </v-chip>
                      </v-fade-transition>
                    </v-col>
                    <v-spacer />
                    <v-col cols="auto" class="d-flex gap-2">
                      <v-btn
                        v-if="selected.length > 0"
                        color="white"
                        variant="tonal"
                        @click="batchToggleVisibility"
                        prepend-icon="mdi-eye-outline"
                        class="mr-2"
                      >
                        Toggle Visibility
                      </v-btn>
                      <v-btn
                        v-if="selected.length > 0"
                        color="error"
                        variant="elevated"
                        @click="deleteSelectedDialog = true"
                        prepend-icon="mdi-delete"
                      >
                        Delete Selected
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="items"
                    :search="search"
                    :loading="loading"
                    item-value="id"
                    show-select
                    class="glass-table"
                    density="comfortable"
                  >
                    <template v-slot:item.name="{ item }">
                      <div
                        v-if="editingId !== item.id"
                        @click="startEdit(item)"
                        class="editable-cell"
                      >
                        <v-icon
                          size="small"
                          class="mr-2"
                          color="white-darken-1"
                        >
                          mdi-pencil
                        </v-icon>
                        <span class="text-white">{{ item.name }}</span>
                      </div>
                      <v-text-field
                        v-else
                        v-model="editingName"
                        @blur="saveEdit(item.id)"
                        @keyup.enter="saveEdit(item.id)"
                        @keyup.esc="cancelEdit"
                        density="compact"
                        hide-details
                        autofocus
                        variant="outlined"
                        class="text-white"
                      />
                    </template>

                    <template v-slot:item.geode_object_type="{ item }">
                      <div class="d-flex align-center">
                        <v-icon
                          :icon="getTypeIcon(item.geode_object_type)"
                          size="small"
                          class="mr-2"
                          color="white"
                        />
                        <v-chip size="small" color="white" variant="outlined">
                          {{ item.geode_object_type || "Unknown" }}
                        </v-chip>
                      </div>
                    </template>

                    <template v-slot:item.created_at="{ item }">
                      <span class="text-white-darken-1">
                        {{ formatDate(item.created_at) }}
                      </span>
                    </template>

                    <template v-slot:item.visible="{ item }">
                      <v-btn
                        :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
                        :color="item.visible ? 'white' : 'grey'"
                        variant="text"
                        @click="toggleVisibility(item)"
                      />
                    </template>

                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        icon="mdi-camera"
                        color="white"
                        variant="text"
                        size="small"
                        @click="focusCamera(item)"
                        v-tooltip.top="'Focus camera'"
                      />
                      <v-btn
                        icon="mdi-delete"
                        color="error"
                        variant="text"
                        size="small"
                        @click="confirmDelete(item)"
                        v-tooltip.top="'Delete'"
                      />
                    </template>

                    <template v-slot:no-data>
                      <div class="text-center pa-12">
                        <v-icon
                          size="80"
                          color="white"
                          class="mb-4 opacity-50"
                        >
                          mdi-database-search-outline
                        </v-icon>
                        <p class="text-h5 text-white font-weight-light">
                          No data found
                        </p>
                        <p class="text-body-1 text-white opacity-70">
                          Try adjusting your search or import new models
                        </p>
                        <v-btn
                          v-if="search"
                          variant="text"
                          color="white"
                          class="mt-4"
                          @click="search = ''"
                        >
                          Clear Search
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirm Delete </v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ itemToDelete?.name }}"? This
          action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteItem">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteSelectedDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirm Delete Multiple </v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selected.length }} item(s)?
          <v-list density="compact" class="bg-transparent mt-2">
            <v-list-item
              v-for="id in selected"
              :key="id"
              :title="items.find(i => i.id === id)?.name"
              prepend-icon="mdi-file-outline"
            />
          </v-list>
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="deleteSelectedDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteSelectedItems">
            Delete All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom right"
      elevation="24"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.icon" class="mr-3" />
        {{ snackbar.text }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup>
  const dataBaseStore = useDataBaseStore()
  const hybridViewerStore = useHybridViewerStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()

  const activeTab = ref("imported")
  const items = ref([])
  const loading = ref(false)
  const selected = ref([])
  const search = ref("")
  const editingId = ref(null)
  const editingName = ref("")
  const deleteDialog = ref(false)
  const deleteSelectedDialog = ref(false)
  const itemToDelete = ref(null)

  const snackbar = reactive({
    show: false,
    text: "",
    color: "success",
    icon: "mdi-check-circle",
  })

  function showFeedback(text, color = "success", icon = "mdi-check-circle") {
    snackbar.text = text
    snackbar.color = color
    snackbar.icon = icon
    snackbar.show = true
  }

  function getTypeIcon(type) {
    if (!type) return "mdi-help-circle-outline"
    const t = type.toLowerCase()
    if (t.includes("mesh")) return "mdi-vector-polygon"
    if (t.includes("model")) return "mdi-cube-outline"
    if (t.includes("point")) return "mdi-circle-medium"
    if (t.includes("curve")) return "mdi-vector-curve"
    if (t.includes("surface")) return "mdi-layers-outline"
    return "mdi-file-outline"
  }

  const headers = [
    { title: "Name", key: "name", sortable: true },
    { title: "Type", key: "geode_object_type", sortable: true },
    { title: "Created", key: "created_at", sortable: true },
    { title: "Visible", key: "visible", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "center" },
  ]

  onMounted(async () => {
    await loadData()
  })

  async function loadData() {
    loading.value = true
    try {
      items.value = await dataBaseStore.getAllItems()
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      loading.value = false
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  function startEdit(item) {
    editingId.value = item.id
    editingName.value = item.name
  }

  async function saveEdit(id) {
    if (editingName.value.trim() === "") {
      cancelEdit()
      return
    }

    try {
      await dataBaseStore.updateItem(id, { name: editingName.value })
      const item = items.value.find((i) => i.id === id)
      if (item) {
        item.name = editingName.value
        treeviewStore.updateItemName(id, editingName.value)
        showFeedback(`Renamed to "${editingName.value}"`)
      }
    } catch (error) {
      console.error("Failed to update item:", error)
      showFeedback("Failed to rename item", "error", "mdi-alert-circle")
    } finally {
      editingId.value = null
      editingName.value = ""
    }
  }

  function cancelEdit() {
    editingId.value = null
    editingName.value = ""
  }

  async function toggleVisibility(item) {
    const newVisibility = !item.visible
    try {
      await dataBaseStore.updateItem(item.id, { visible: newVisibility })
      item.visible = newVisibility

      if (newVisibility) {
        await treeviewStore.addItem(
          item.geode_object_type,
          item.name,
          item.id,
          item.object_type,
        )
        await hybridViewerStore.addItem(item.id)
        await dataStyleStore.setVisibility(item.id, true)
      } else {
        await dataStyleStore.setVisibility(item.id, false)
        treeviewStore.removeItem(item.id)
        await hybridViewerStore.removeItem(item.id)
      }
      
      hybridViewerStore.remoteRender()
      showFeedback(newVisibility ? "Item is now visible" : "Item is now hidden")
    } catch (error) {
      console.error("Failed to toggle visibility:", error)
      showFeedback("Failed to toggle visibility", "error", "mdi-alert-circle")
    }
  }

  async function batchToggleVisibility() {
    if (selected.value.length === 0) return
    
    const firstItem = items.value.find(i => i.id === selected.value[0])
    try {
      for (const id of selected.value) {
        const item = items.value.find(i => i.id === id)
        if (item && item.visible !== targetVisibility) {
          await dataBaseStore.updateItem(id, { visible: targetVisibility })
          item.visible = targetVisibility
          
          if (targetVisibility) {
            await treeviewStore.addItem(
              item.geode_object_type,
              item.name,
              item.id,
              item.object_type,
            )
            await hybridViewerStore.addItem(item.id)
            await dataStyleStore.setVisibility(item.id, true)
          } else {
            await dataStyleStore.setVisibility(item.id, false)
            treeviewStore.removeItem(item.id)
            await hybridViewerStore.removeItem(item.id)
          }
        }
      }
      hybridViewerStore.remoteRender()
      showFeedback(`Visibility toggled for ${selected.value.length} items`)
    } catch (error) {
      console.error("Batch visibility toggle failed:", error)
      showFeedback("Batch visibility toggle failed", "error", "mdi-alert-circle")
    }
  }

  function confirmDelete(item) {
    itemToDelete.value = item
    deleteDialog.value = true
  }

  async function deleteItem() {
    if (!itemToDelete.value) return

    try {
      await dataBaseStore.deleteItem(itemToDelete.value.id)
      items.value = items.value.filter((i) => i.id !== itemToDelete.value.id)

      await dataBaseStore.deregisterObject(itemToDelete.value.id)
      await hybridViewerStore.removeItem(itemToDelete.value.id)
      treeviewStore.removeItem(itemToDelete.value.id)
      hybridViewerStore.remoteRender()
      
      showFeedback(`Deleted "${itemToDelete.value.name}"`)
    } catch (error) {
      console.error("Failed to delete item:", error)
      showFeedback("Failed to delete item", "error", "mdi-alert-circle")
    } finally {
      deleteDialog.value = false
      itemToDelete.value = null
    }
  }

  async function deleteSelectedItems() {
    try {
      for (const id of selected.value) {
        await dataBaseStore.deleteItem(id)
        await dataBaseStore.deregisterObject(id)
        await hybridViewerStore.removeItem(id)
        treeviewStore.removeItem(id)
      }
      hybridViewerStore.remoteRender()

      items.value = items.value.filter((i) => !selected.value.includes(i.id))
      const count = selected.value.length
      selected.value = []
      showFeedback(`Deleted ${count} items`)
    } catch (error) {
      console.error("Failed to delete selected items:", error)
      showFeedback("Failed to delete selected items", "error", "mdi-alert-circle")
    } finally {
      deleteSelectedDialog.value = false
    }
  }

  async function focusCamera(item) {
    const hybridViewerStore = useHybridViewerStore()
    if (!hybridViewerStore.db[item.id]) {
      console.warn("Item not in viewer:", item.id)
      return
    }

    const renderer = hybridViewerStore.genericRenderWindow.value.getRenderer()
    const actor = hybridViewerStore.db[item.id].actor
    renderer.resetCamera(actor.getBounds())
    hybridViewerStore.genericRenderWindow.value.getRenderWindow().render()
    hybridViewerStore.syncRemoteCamera()
    showFeedback(`Focused on "${item.name}"`, "info", "mdi-camera")
  }
</script>

<style scoped>
  .editable-cell {
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
  }

  .editable-cell:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .glass-table {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px !important;
    overflow: hidden;
  }

  .search-bar {
    max-width: 300px;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px;
  }

  .search-bar :deep(.v-field) {
    background: transparent !important;
    color: white !important;
  }

  .search-bar :deep(.v-field__outline) {
    display: none;
  }

  :deep(.v-data-table) {
    background: transparent !important;
  }

  :deep(.v-data-table thead) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  :deep(.v-data-table th) {
    color: white !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 1px;
  }

  :deep(.v-data-table td) {
    color: rgba(255, 255, 255, 0.9) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }

  :deep(.v-data-table tbody tr:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  :deep(.v-checkbox .v-selection-control) {
    color: white !important;
  }

  :deep(.v-pagination__item--active) {
    background-color: white !important;
    color: var(--v-primary-base) !important;
  }

  .opacity-50 {
    opacity: 0.5;
  }

  .opacity-70 {
    opacity: 0.7;
  }

  .gap-2 {
    gap: 8px;
  }
</style>
