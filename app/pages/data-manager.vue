<script setup>
  import BatchActionBanner from "@vease/components/datamanager/BatchActionBanner.vue"
  import DataManagerHeader from "@vease/components/datamanager/DataManagerHeader.vue"
  import DataTable from "@vease/components/datamanager/DataTable.vue"
  import DeleteDialog from "@vease/components/datamanager/DeleteDialog.vue"
  import RenameDialog from "@vease/components/datamanager/RenameDialog.vue"

  import { useEventListener, useMagicKeys, whenever } from "@vueuse/core"
  import { useDataStore } from "@ogw_front/stores/data"
  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
  import { useTreeviewStore } from "@ogw_front/stores/treeview"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()
  const dataStore = useDataStore()
  const hybridViewerStore = useHybridViewerStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()

  const search = ref("")
  const viewMode = ref("list")
  const items = dataStore.getAllItems()
  const activeTab = ref("data")
  const selectedIds = ref([])

  const deleteSelectedDialog = ref(false)
  const deleteSingleDialog = ref(false)
  const itemToDelete = ref(null)
  const renameDialog = ref(false)
  const itemToRename = ref(null)
  const newItemName = ref("")

  const snackbar = reactive({ show: false, text: "", color: "success" })
  const headerRef = useTemplateRef("headerRef")

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

  async function toggleVisibility(item) {
    const newVisible = !item.visible
    await dataStore.updateItem(item.id, { visible: newVisible })
    await dataStyleStore.setVisibility(item.id, newVisible, item)
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

  async function focusCamera(item) {
    const data = hybridViewerStore.hybridDb[item.id]
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

  async function confirmRename(newName) {
    if (!newName || !itemToRename.value) return
    try {
      itemToRename.value.name = newName
      await dataStore.updateItem(itemToRename.value.id, {
        name: newName,
      })
      treeviewStore.removeItem(itemToRename.value.id)
      await treeviewStore.addItem(
        itemToRename.value.geode_object_type,
        newName,
        itemToRename.value.id,
        itemToRename.value.viewer_type,
      )
      renameDialog.value = false
      showFeedback("Renamed successfully")
    } catch (error) {
      console.error(error)
      showFeedback("Failed to rename", "error")
    }
  }

  async function isolateItem(item) {
    const promises = items.value.map(async (i) => {
      const visible = i.id === item.id
      await dataStore.updateItem(i.id, { visible })
      await dataStyleStore.setVisibility(i.id, visible, i)
      i.visible = visible
      if (!visible) treeviewStore.removeItem(i.id)
    })
    await Promise.all(promises)
    focusCamera(item)
  }

  function confirmDelete(item) {
    itemToDelete.value = item
    deleteSingleDialog.value = true
  }

  async function executeDelete() {
    if (!itemToDelete.value) return
    await dataStore.deregisterObject(itemToDelete.value.id)
    await dataStore.deleteItem(itemToDelete.value.id)
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
    const idsToDelete = selectedIds.value.map((selected) => selected.id)
    const promises = idsToDelete.map(async (id) => {
      await dataStore.deregisterObject(id)
      await dataStore.deleteItem(id)
      await hybridViewerStore.removeItem(id)
      treeviewStore.removeItem(id)
    })
    await Promise.all(promises)
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

  useEventListener(document, "keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "k" || event.key === "K")
    ) {
      event.preventDefault()
      headerRef.value?.focusSearch()
    }
  })
</script>

<template>
  <v-container fluid class="pa-8 bg-transparent data-manager-container">
    <v-row no-gutters class="fill-height">
      <v-col class="d-flex flex-column fill-height overflow-hidden">
        <DataManagerHeader
          v-model:search-value="search"
          v-model:active-tab="activeTab"
          :tabs="UIStore.dataManagerTabs"
          ref="headerRef"
          class="mb-6"
        />

        <v-window
          v-model="activeTab"
          class="flex-grow-1 overflow-hidden glass-panel rounded-lg"
        >
          <v-window-item value="data" class="fill-height overflow-y-auto pa-6">
            <BatchActionBanner
              :selected-count="selectedIds.length"
              @delete="deleteSelectedDialog = true"
              @clear="selectedIds = []"
            />

            <DataTable
              v-if="viewMode === 'list'"
              v-model:selected-ids="selectedIds"
              :items="items"
              :search="search"
              @toggle-visibility="toggleVisibility"
              @focus-camera="focusCamera"
              @isolate="isolateItem"
              @rename="openRenameDialog"
              @delete="confirmDelete"
            />
          </v-window-item>

          <v-window-item
            v-for="tab in UIStore.datamanagerTabs"
            :key="tab.id"
            :value="tab.id"
            class="fill-height overflow-y-auto pa-4"
          >
            <component :is="tab.component" v-bind="tab.props" />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <DeleteDialog
      v-model:show="deleteSingleDialog"
      :item="itemToDelete"
      @confirm="executeDelete"
    />

    <DeleteDialog
      v-model:show="deleteSelectedDialog"
      :selected-count="selectedIds.length"
      @confirm="deleteSelected"
    />

    <RenameDialog
      v-model:show="renameDialog"
      :item="itemToRename"
      :initial-name="newItemName"
      @confirm="confirmRename"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      >{{ snackbar.text }}</v-snackbar
    >
  </v-container>
</template>

<style scoped>
  .data-manager-container {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }
</style>
