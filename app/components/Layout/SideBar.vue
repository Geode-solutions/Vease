<script setup>
import { useAuth } from "@vease/composables/auth";
import { useUIStore } from "@vease/stores/ui";

const { user } = useAuth();
const UIStore = useUIStore();

const drawer = ref(true);

const topPages = ref([
  {
    title: "Viewer",
    icon: "mdi-rotate-orbit",
    testId: "viewerNavButton",
    click: () => navigateTo("/"),
  },
  {
    title: "Data Manager",
    icon: "mdi-database",
    testId: "dataManagerNavButton",
    click: () => navigateTo("/data_manager"),
  },
  {
    title: "Extensions",
    icon: "mdi-puzzle",
    click: () => navigateTo("/extensions"),
  },
]);

const bottomPages = computed(() => {
  const pages = [];

  if (user.value) {
    pages.push({
      title: "Account",
      icon: "mdi-account-outline",
      click: () => navigateTo("/account"),
    });
  } else {
    pages.push({
      title: "Login",
      icon: "mdi-account-key-outline",
      click: () => navigateTo("/login"),
    });
  }

  pages.push({
    title: "Infos",
    icon: "mdi-information-outline",
    click: () => navigateTo("/infos"),
  });

  return pages;
});

let draggedItem = undefined;

function startDrag(event, item) {
  draggedItem = item;
  event.dataTransfer.setData("text/plain", "sidebar-icon");
}

function onDrop(event, dropIndex) {
  const dragIndex = topPages.value.indexOf(draggedItem);
  if (dragIndex === dropIndex) {
    return;
  }

  topPages.value.splice(dragIndex, 1);
  topPages.value.splice(dropIndex, 0, draggedItem);
  draggedItem = undefined;
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
      class="d-flex flex-column align-center py-4 fill-height"
      style="width: 100%"
      @mousedown.stop
    >
      <div v-for="(item, index) in topPages" :key="index" class="mb-3">
        <v-tooltip :text="item.title" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="transparent"
              :data-testid="item.testId"
              @click="item.click"
              class="icon-style pa-2 rounded-lg"
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

      <div v-for="(item, index) in bottomPages" :key="index" class="mb-3">
        <v-tooltip :text="item.title" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              flat
              color="transparent"
              @click="item.click"
              class="icon-style pa-2 rounded-lg"
              width="48"
              height="48"
              draggable="false"
            >
              <v-icon :icon="item.icon" color="white" size="28" />
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.icon-style {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-style:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.v-navigation-drawer__content) {
  overflow: visible !important;
}
</style>
