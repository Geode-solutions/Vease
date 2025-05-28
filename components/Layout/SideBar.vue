<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="80"
    align="center"
    color="#FFFFFF00"
    class="py-4"
    elevation="0"
    floating
    app
    permanent
  >
    <v-row no-gutters class="flex-column" style="height: 100%">
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
  </v-navigation-drawer>
</template>

<script setup>
import isElectron from "is-electron";

const drawer = ref(true);
const newproject = ref(false);
const openproject = ref(false);

const items = ref([
  {
    title: "Home",
    icon: "mdi-home",
    click: () => navigateTo("/"),
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
]);

let draggedItem = null;

const startDrag = (event, item) => {
  draggedItem = item;
  event.dataTransfer.setData("text/plain", "sidebar-icon");
};

const onDrop = (event, dropIndex) => {
  const dragIndex = items.value.findIndex((item) => item === draggedItem);
  if (dragIndex === dropIndex) return;

  items.value.splice(dragIndex, 1);
  items.value.splice(dropIndex, 0, draggedItem);
  draggedItem = null;
};
</script>
