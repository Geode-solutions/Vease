<template>
  <v-container fluid class="pa-0 fill-height bg-transparent">
    <v-row no-gutters class="fill-height">
      <v-col class="d-flex flex-column fill-height overflow-hidden">
        <div class="glass-header pa-4">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center ga-4">
              <h2 class="text-h5 text-white font-weight-light">Data Manager</h2>
              <v-btn
                icon="mdi-refresh"
                size="small"
                variant="text"
                color="white"
                @click="loadData"
                :loading="loading"
              />
            </div>

            <v-btn-toggle
              v-model="viewMode"
              mandatory
              density="compact"
              theme="dark"
              variant="outlined"
              divided
            >
              <v-btn value="list" icon="mdi-view-list" size="small" />
              <v-btn value="grid" icon="mdi-view-grid" size="small" />
            </v-btn-toggle>
          </div>

          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search data... (Ctrl+K)"
            variant="solo"
            density="compact"
            hide-details
            flat
            rounded="lg"
            clearable
            class="search-field"
            ref="searchInput"
          />
        </div>

        <div class="flex-grow-1 overflow-y-auto pa-4">
          <v-expand-transition>
            <div
              v-if="selectedIds.length > 0"
              class="mb-4 pa-2 batch-banner rounded-lg d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <span class="text-subtitle-2 text-white px-2"
                  >{{ selectedIds.length }} items selected</span
                >
                <v-divider vertical class="mx-2" />
                <v-btn
                  prepend-icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteSelectedDialog = true"
                  >Delete</v-btn
                >
              </div>
              <v-btn
                icon="mdi-close"
                size="x-small"
                variant="text"
                color="white"
                @click="selectedIds = []"
              />
            </div>
          </v-expand-transition>

          <v-data-table
            v-if="viewMode === 'list'"
            v-model="selectedIds"
            :headers="headers"
            :items="items"
            :search="search"
            show-select
            theme="dark"
            hover
            class="custom-table"
            item-value="id"
            return-object
          >
            <template v-slot:item.name="{ item }">
              <span
                class="font-weight-medium cursor-pointer text-white title-hover"
                @click="openRenameDialog(item)"
              >
                {{ item.name }}
              </span>
            </template>

            <template v-slot:item.geode_object_type="{ item }">
              <div class="d-flex flex-column py-2 align-start">
                <v-chip
                  size="x-small"
                  variant="outlined"
                  class="type-chip mb-1 d-inline-flex"
                >
                  {{ item.geode_object_type }}
                </v-chip>
                <span class="text-caption text-white-opacity-60">{{
                  getItemMetadata(item)
                }}</span>
              </div>
            </template>

            <template v-slot:item.created_at="{ item }">
              <span class="text-caption text-white-opacity-60">{{
                formatSmartDate(item.created_at)
              }}</span>
            </template>

            <template v-slot:item.visible="{ item }">
              <v-btn
                :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
                size="small"
                variant="text"
                color="white"
                @click.stop="toggleVisibility(item)"
              />
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex ga-1 justify-end">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  @click.stop="focusCamera(item)"
                >
                  <v-icon>mdi-target</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Focus Camera</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  @click.stop="isolateItem(item)"
                >
                  <v-icon>mdi-filter-variant</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Isolate</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  @click.stop="openRenameDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Rename</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click.stop="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Delete</v-tooltip
                  >
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <v-row v-else class="mt-2">
            <v-col
              v-for="item in filteredItems"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                variant="outlined"
                class="glass-card h-100 cursor-pointer"
                :class="{ 'card-selected': isSelected(item) }"
                @click="toggleSelection(item)"
              >
                <div v-if="isSelected(item)" class="selection-indicator">
                  <v-icon color="white" size="20">mdi-check-circle</v-icon>
                </div>

                <v-card-text class="pa-4 text-white">
                  <div
                    class="text-subtitle-1 font-weight-bold text-truncate mb-2 title-clickable"
                    @click.stop="openRenameDialog(item)"
                  >
                    {{ item.name }}
                  </div>
                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="flat"
                    class="mb-3"
                    >{{ item.geode_object_type }}</v-chip
                  >
                  <div class="text-caption text-white-opacity-60">
                    {{ formatSmartDate(item.created_at) }}
                  </div>
                </v-card-text>

                <v-divider class="border-opacity-10" />

                <v-card-actions class="pa-2">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="white"
                    @click.stop="toggleVisibility(item)"
                  >
                    <v-icon size="20">{{
                      item.visible ? "mdi-eye" : "mdi-eye-off"
                    }}</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Toggle Visibility</v-tooltip
                    >
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="white"
                    @click.stop="focusCamera(item)"
                  >
                    <v-icon size="20">mdi-target</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Focus Camera</v-tooltip
                    >
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="white"
                    @click.stop="isolateItem(item)"
                  >
                    <v-icon size="20">mdi-filter-variant</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Isolate</v-tooltip
                    >
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="white"
                    @click.stop="openRenameDialog(item)"
                  >
                    <v-icon size="20">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Rename</v-tooltip
                    >
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="confirmDelete(item)"
                  >
                    <v-icon size="20">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Delete</v-tooltip
                    >
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteSingleDialog" max-width="400" persistent>
      <v-card rounded="xl" class="bg-white text-center overflow-hidden">
        <div class="bg-error w-100" style="height: 6px"></div>
        <v-avatar color="red-lighten-5" size="64" class="mt-8 mx-auto"
          ><v-icon color="error" size="32"
            >mdi-trash-can-outline</v-icon
          ></v-avatar
        >
        <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
          >Delete Item</v-card-title
        >
        <v-card-text class="text-grey-darken-1 px-8">
          Are you sure you want to delete this item?
          <div
            class="bg-grey-lighten-4 rounded-lg pa-3 my-4 text-grey-darken-3 font-weight-bold border"
          >
            {{ itemToDelete?.name }}
          </div>
        </v-card-text>
        <v-card-actions class="px-8 pb-8"
          ><v-spacer /><v-btn variant="text" @click="deleteSingleDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            class="px-8 rounded-pill"
            @click="executeDelete"
            >Delete</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteSelectedDialog" max-width="400" persistent>
      <v-card rounded="xl" class="bg-white text-center overflow-hidden">
        <div class="bg-error w-100" style="height: 6px"></div>
        <v-avatar color="red-lighten-5" size="64" class="mt-8 mx-auto"
          ><v-icon color="error" size="32"
            >mdi-alert-circle-outline</v-icon
          ></v-avatar
        >
        <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
          >Delete Items</v-card-title
        >
        <v-card-text class="text-grey-darken-1 px-8">
          Are you sure you want to delete
          <strong>{{ selectedIds.length }}</strong> items?
        </v-card-text>
        <v-card-actions class="px-8 pb-8"
          ><v-spacer /><v-btn
            variant="text"
            @click="deleteSelectedDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            class="px-8 rounded-pill"
            @click="deleteSelected"
            >Delete All</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="renameDialog" max-width="400">
      <v-card rounded="xl" class="bg-white text-center overflow-hidden">
        <div class="bg-primary w-100" style="height: 6px"></div>
        <v-avatar color="blue-lighten-5" size="64" class="mt-8 mx-auto"
          ><v-icon color="primary" size="32"
            >mdi-pencil-outline</v-icon
          ></v-avatar
        >
        <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
          >Rename Item</v-card-title
        >
        <v-card-text class="px-8">
          <v-text-field
            v-model="newItemName"
            label="New Name"
            variant="outlined"
            color="primary"
            class="mt-4"
            @keydown.enter="confirmRename"
          />
        </v-card-text>
        <v-card-actions class="px-8 pb-8"
          ><v-spacer /><v-btn variant="text" @click="renameDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            variant="flat"
            class="px-8 rounded-pill"
            @click="confirmRename"
            >Rename</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      >{{ snackbar.text }}</v-snackbar
    >
  </v-container>
</template>

<script setup>
  import { useDataBaseStore } from "@ogw_front/stores/data_base"
  import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
  import { useTreeviewStore } from "@ogw_front/stores/treeview"
  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useMagicKeys, useEventListener, whenever } from "@vueuse/core"

  const dataBaseStore = useDataBaseStore()
  const hybridViewerStore = useHybridViewerStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()

  const loading = ref(false)
  const search = ref("")
  const viewMode = ref("list")
  const items = ref([])

  const selectedIds = ref([])

  const deleteSelectedDialog = ref(false)
  const deleteSingleDialog = ref(false)
  const itemToDelete = ref(null)
  const renameDialog = ref(false)
  const itemToRename = ref(null)
  const newItemName = ref("")

  const snackbar = reactive({ show: false, text: "", color: "success" })
  const searchInput = useTemplateRef("searchInput")

  const headers = [
    { title: "Name", key: "name", sortable: true },
    { title: "Type", key: "geode_object_type", sortable: true },
    { title: "Date", key: "created_at", sortable: true },
    { title: "Visibility", key: "visible", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "end" },
  ]

  function formatSmartDate(dateStr) {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    let relative = ""
    if (diff < 60) relative = "just now"
    else if (diff < 3600) relative = `${Math.floor(diff / 60)}m ago`
    else if (diff < 86400) relative = `${Math.floor(diff / 3600)}h ago`
    else relative = `${Math.floor(diff / 86400)}d ago`
    return `${relative} (${date.toLocaleDateString()})`
  }

  const filteredItems = computed(() => {
    if (!search.value) return items.value
    const lower = search.value.toLowerCase()
    return items.value.filter((i) => i.name?.toLowerCase().includes(lower))
  })

  function isSelected(item) {
    return selectedIds.value.some((selected) => selected.id === item.id)
  }

  function toggleSelection(item) {
    const index = selectedIds.value.findIndex(
      (selected) => selected.id === item.id,
    )
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(item)
    }
  }

  async function loadData() {
    loading.value = true
    try {
      items.value = await dataBaseStore.getAllItems()
    } finally {
      loading.value = false
    }
  }

  async function toggleVisibility(item) {
    const newVisible = !item.visible
    await dataBaseStore.updateItem(item.id, { visible: newVisible })
    await dataStyleStore.setVisibility(item.id, newVisible)
    item.visible = newVisible
    if (newVisible) {
      await treeviewStore.addItem(
        item.geode_object_type,
        item.name,
        item.id,
        item.viewer_type,
      )
    } else {
      treeviewStore.removeItem(item.id)
    }
  }

  function getItemMetadata(item) {
    const data = hybridViewerStore.db[item.id]
    if (!data?.polydata) return ""
    const pts = data.polydata.getNumberOfPoints().toLocaleString()
    const cells = data.polydata.getNumberOfCells().toLocaleString()
    const bounds = data.polydata.getBounds()
    let meta = `${pts} pts | ${cells} cells`
    if (bounds?.length === 6) {
      const dx = Math.round((bounds[1] - bounds[0]) * 100) / 100
      const dy = Math.round((bounds[3] - bounds[2]) * 100) / 100
      const dz = Math.round((bounds[5] - bounds[4]) * 100) / 100
      meta += ` | Box: ${dx}x${dy}x${dz}`
    }
    return meta
  }

  async function focusCamera(item) {
    const data = hybridViewerStore.db[item.id]
    if (data?.actor) {
      const renderer = hybridViewerStore.genericRenderWindow.value.getRenderer()
      renderer.resetCamera(data.actor.getBounds())
      hybridViewerStore.genericRenderWindow.value.getRenderWindow().render()
      hybridViewerStore.syncRemoteCamera()
    }
  }

  function openRenameDialog(item) {
    itemToRename.value = item
    newItemName.value = item.name
    renameDialog.value = true
  }

  async function confirmRename() {
    if (!newItemName.value || !itemToRename.value) return
    try {
      itemToRename.value.name = newItemName.value
      await dataBaseStore.updateItem(itemToRename.value.id, {
        name: newItemName.value,
      })
      treeviewStore.removeItem(itemToRename.value.id)
      await treeviewStore.addItem(
        itemToRename.value.geode_object_type,
        newItemName.value,
        itemToRename.value.id,
        itemToRename.value.viewer_type,
      )
      renameDialog.value = false
      showFeedback("Renamed successfully")
    } catch (e) {
      showFeedback("Failed to rename", "error")
    }
  }

  async function isolateItem(item) {
    for (const i of items.value) {
      const visible = i.id === item.id
      await dataBaseStore.updateItem(i.id, { visible })
      await dataStyleStore.setVisibility(i.id, visible)
      i.visible = visible
      if (!visible) treeviewStore.removeItem(i.id)
    }
    focusCamera(item)
  }

  function confirmDelete(item) {
    itemToDelete.value = item
    deleteSingleDialog.value = true
  }

  async function executeDelete() {
    if (!itemToDelete.value) return
    await dataBaseStore.deleteItem(itemToDelete.value.id)
    await hybridViewerStore.removeItem(itemToDelete.value.id)
    treeviewStore.removeItem(itemToDelete.value.id)
    items.value = items.value.filter((i) => i.id !== itemToDelete.value.id)
    selectedIds.value = selectedIds.value.filter(
      (selected) => selected.id !== itemToDelete.value.id,
    )
    deleteSingleDialog.value = false
    showFeedback("Item deleted")
  }

  async function deleteSelected() {
    const idsToDelete = selectedIds.value.map((item) => item.id)
    for (const id of idsToDelete) {
      await dataBaseStore.deleteItem(id)
      await hybridViewerStore.removeItem(id)
      treeviewStore.removeItem(id)
    }
    items.value = items.value.filter((i) => !idsToDelete.includes(i.id))
    selectedIds.value = []
    deleteSelectedDialog.value = false
    showFeedback("Selected items deleted")
  }

  function showFeedback(text, color = "success") {
    snackbar.text = text
    snackbar.color = color
    snackbar.show = true
  }

  const { delete: del } = useMagicKeys()
  whenever(del, () => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return
    if (selectedIds.value.length > 0) deleteSelectedDialog.value = true
  })

  useEventListener(document, "keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault()
      searchInput.value?.focus()
    }
  })

  onMounted(loadData)
</script>

<style scoped>
  .glass-header {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .search-field :deep(.v-field) {
    background: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }

  .custom-table {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .type-chip {
    border-color: rgba(255, 255, 255, 0.3) !important;
    color: white !important;
    background: rgba(255, 255, 255, 0.05) !important;
    height: 20px !important;
    width: auto !important;
  }

  .text-white-opacity-60 {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    transition: all 0.25s ease;
    position: relative;
  }

  .glass-card:hover {
    border-color: rgba(255, 255, 255, 0.25) !important;
    background: rgba(255, 255, 255, 0.08) !important;
    transform: translateY(-2px);
  }

  .card-selected {
    border-color: rgb(var(--v-theme-primary)) !important;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.2) 0%,
      rgba(var(--v-theme-primary), 0.1) 100%
    ) !important;
    box-shadow:
      0 0 0 1px rgba(var(--v-theme-primary), 0.3),
      0 8px 32px rgba(var(--v-theme-primary), 0.2);
  }

  .card-selected:hover {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.25) 0%,
      rgba(var(--v-theme-primary), 0.15) 100%
    ) !important;
  }

  .selection-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    background: rgba(var(--v-theme-primary), 0.9);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .title-clickable {
    transition: color 0.2s ease;
  }

  .title-clickable:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .batch-banner {
    background: rgba(var(--v-theme-primary), 0.15);
    border: 1px solid rgba(var(--v-theme-primary), 0.3);
  }

  .cursor-pointer {
    cursor: pointer;
  }

  :deep(.v-data-table-header__content) {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: bold;
  }

  :deep(.v-overlay__scrim) {
    background: rgba(0, 0, 0, 0.85) !important;
    backdrop-filter: blur(8px);
  }
</style>
