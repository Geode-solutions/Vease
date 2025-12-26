<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="80"
    color="#FFFFFF00"
    class="py-4"
    elevation="0"
    floating
    app
    permanent
  >
    <v-row
      no-gutters
      class="flex-column"
      style="height: 100%"
      align="center"
      justify="center"
    >
      <v-col cols="auto" v-for="(item, index) in items" :key="index">
        <v-tooltip :text="item.title">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="#FFFFFF00"
              @click="item.click"
              style="border-radius: 20%"
              :icon="item.icon"
              class="mb-1"
              draggable="false"
              @dragstart="startDrag($event, item)"
              @drop="onDrop($event, index)"
              @dragover.prevent
              data-type="sidebar-icon"
            >
              <v-icon
                class="icon-style pa-6"
                :icon="item.icon"
                color="white"
                size="28"
              />
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>

      <v-spacer />
      <v-col cols="auto">
        <v-tooltip text="Infos">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="#FFFFFF00"
              @click="navigateTo('/infos')"
              style="border-radius: 20%"
              icon="mdi-information-variant-circle"
              class="mb-1"
              @dragover.prevent
              data-type="sidebar-icon"
            >
              <v-icon
                class="icon-style pa-6"
                icon="mdi-information-variant-circle"
                color="white"
                size="28"
              />
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <NewProject :show_dialog="newproject" @close="newproject = false" />
    <OpenProject :show_dialog="openproject" @close="openproject = false" />
    <input
      ref="importFileInput"
      type="file"
      accept=".vease"
      style="display: none"
      @change="onImportFileSelected"
    />
  </v-navigation-drawer>
</template>

<script setup>
  import { useProjectManager } from "@ogw_front/composables/project_manager"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()

  const drawer = ref(true)
  const newproject = ref(false)
  const openproject = ref(false)
  const importFileInput = templateRef("importFileInput")

  const toggleExtensions = () => {
    UIStore.setShowExtensions(!UIStore.showExtensions)
  }

  const items = ref([
    {
      title: "Home",
      icon: "mdi-home",
      click: () => navigateTo("/"),
    },
    {
      title: "Extensions",
      icon: "mdi-puzzle",
      click: () => toggleExtensions(),
    },
    {
      title: "Data Manager",
      icon: "mdi-database-cog",
      click: () => navigateTo("/data-manager"),
    },
    // {
    //   title: "New Project",
    //   icon: "mdi-plus",
    //   click: () => (newproject.value = true),
    // },
    // {
    //   title: "Open Project",
    //   icon: "mdi-folder-outline",
    //   click: () => (openproject.value = true),
    // },
    {
      title: "Import Project",
      icon: "mdi-download",
      click: () => triggerImport(),
    },
    {
      title: "Export Project",
      icon: "mdi-upload",
      click: () => triggerExport(),
    },
    // {
    //   title: "Open new window",
    //   icon: "mdi-dock-window",
    //   click: () => {
    //     if (isElectron()) {
    //       window.electronAPI.new_window();
    //     } else {
    //       console.log("notElectron");

    //       window.open("http://localhost:3000", "_blank");
    //     }
    //   },
    // },
  ])

  let draggedItem = null

  const startDrag = (event, item) => {
    draggedItem = item
    event.dataTransfer.setData("text/plain", "sidebar-icon")
  }

  const onDrop = (event, dropIndex) => {
    const dragIndex = items.value.findIndex((item) => item === draggedItem)
    if (dragIndex === dropIndex) return

    items.value.splice(dragIndex, 1)
    items.value.splice(dropIndex, 0, draggedItem)
    draggedItem = null
  }

  const { importProjectFile, exportProject } = useProjectManager()

  function triggerImport() {
    importFileInput.value?.click()
  }

  function onImportFileSelected(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".vease")) {
      event.target.value = ""
      return
    }
    importProjectFile(file)
    event.target.value = ""
  }

  function triggerExport() {
    exportProject()
  }
</script>
