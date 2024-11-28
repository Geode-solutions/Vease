<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="70"
    align="center"
    class="mt-10 ma-2"
    color="#FFFFFF00"
    elevation="0"
    floating
    app
    permanent
  >
    <v-tooltip v-for="(item, index) in items" :key="index" :text="item.title">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          flat
          color="#FFFFFF00"
          @click="item.click"
          style="border-radius: 20%"
          :icon="item.icon"
          class="mb-1"
          draggable="true"
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

    <NewProject :show_dialog="newproject" @close="newproject = false" />
    <OpenProject :show_dialog="openproject" @close="openproject = false" />
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(true);
const newproject = ref(false);
const openproject = ref(false);

const items = ref([
  {
    title: "Home",
    icon: "mdi-home",
    click: () => navigateTo("/"),
  },
  {
    title: "New Project",
    icon: "mdi-plus",
    click: () => (newproject.value = true),
  },
  {
    title: "Open Project",
    icon: "mdi-folder-outline",
    click: () => (openproject.value = true),
  },

  {
    title: "Test",
    icon: "mdi-test-tube",
    click: () => navigateTo("/test"),
  },
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
