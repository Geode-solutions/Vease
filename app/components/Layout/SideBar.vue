<script setup>
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()

  const drawer = ref(true)

  const items = ref([
    {
      title: "Home",
      icon: "mdi-rotate-orbit",
      click: () => navigateTo("/"),
    },
    {
      title: "Data Manager",
      icon: "mdi-database",
      click: () => navigateTo("/data-manager"),
    },
  ])

  let draggedItem = null

  function startDrag(event, item) {
    draggedItem = item
    event.dataTransfer.setData("text/plain", "sidebar-icon")
  }

  function onDrop(event, dropIndex) {
    const dragIndex = items.value.indexOf(draggedItem)
    if (dragIndex === dropIndex) return

    items.value.splice(dragIndex, 1)
    items.value.splice(dropIndex, 0, draggedItem)
    draggedItem = null
  }
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    width="90"
    color="transparent"
    class="border-0 pb-2 pt-0"
    elevation="0"
    floating
    permanent
  >
    <div
      class="glass-panel rounded-xl d-flex flex-column align-center py-4 fill-height"
      style="width: 70px; margin: 0 10px 10px 10px"
    >
      <div v-for="(item, index) in items" :key="index" class="mb-3">
        <v-tooltip :text="item.title" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="transparent"
              @click="item.click"
              class="icon-style pa-2"
              width="48"
              height="48"
              draggable="false"
              @dragstart="startDrag($event, item)"
              @drop="onDrop($event, index)"
              @dragover.prevent
            >
              <v-icon :icon="item.icon" color="white" size="28" />
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <v-spacer />

      <v-tooltip text="Infos" location="right">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            flat
            color="transparent"
            @click="navigateTo('/infos')"
            class="icon-style pa-2"
            width="48"
            height="48"
          >
            <v-icon icon="mdi-information-outline" color="white" size="28" />
          </v-btn>
        </template>
      </v-tooltip>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
  .icon-style {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .icon-style:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  :deep(.v-navigation-drawer__content) {
    overflow: visible !important;
  }
</style>
