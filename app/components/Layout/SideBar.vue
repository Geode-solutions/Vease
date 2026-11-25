<script setup lang="ts">
import { useActivityStore } from "@ogw_front/stores/activity";
import { useAuth } from "@vease/composables/auth";
import { useUIStore } from "@vease/stores/ui";

interface SidebarPage {
  title: string;
  icon: string;
  testId?: string;
  badge?: () => number;
  isActive?: () => boolean;
  click: () => unknown;
}

const { isUserAuthenticated } = useAuth();
const UIStore = useUIStore();
const activityStore = useActivityStore();
const route = useRoute();

function isRoute(path: string): () => boolean {
  return (): boolean => route.path === path;
}

const drawer = ref(true);

const topPages = ref<SidebarPage[]>([
  {
    title: "Viewer",
    icon: "ph-planet",
    testId: "viewerNavButton",
    isActive: isRoute("/"),
    click: (): unknown => navigateTo("/"),
  },
  {
    title: "Data Manager",
    icon: "ph-database",
    testId: "dataManagerNavButton",
    isActive: isRoute("/data_manager"),
    click: (): unknown => navigateTo("/data_manager"),
  },
  {
    title: "Extensions",
    icon: "ph-puzzle-piece",
    testId: "extensionsNavButton",
    isActive: isRoute("/extensions"),
    click: (): unknown => navigateTo("/extensions"),
  },
]);

const bottomPages = computed(() => {
  const pages = [
    {
      title: "Chat",
      icon: "ph-chat",
      testId: "chatNavButton",
      isActive: (): boolean => UIStore.showChatPiP,
      click: (): unknown => UIStore.setShowChatPiP(!UIStore.showChatPiP),
    },
    {
      title: "Activity",
      icon: "ph-terminal-window",
      testId: "activityNavButton",
      badge: (): number => activityStore.unseen_errors,
      isActive: (): boolean => UIStore.showActivityPiP,
      click: (): unknown => UIStore.setShowActivityPiP(!UIStore.showActivityPiP),
    },

    {
      title: isUserAuthenticated.value ? "Account" : "Login",
      icon: isUserAuthenticated.value ? "ph-user" : "ph-key",
      testId: "accountNavButton",
      isActive: isRoute("/account"),
      click: (): unknown => navigateTo("/account"),
    },

    {
      title: "Infos",
      icon: "ph-info",
      testId: "infosNavButton",
      isActive: isRoute("/infos"),
      click: (): unknown => navigateTo("/infos"),
    },
  ];

  return pages;
});

let draggedItem: SidebarPage | undefined = undefined;

function startDrag(event: DragEvent, item: SidebarPage): void {
  draggedItem = item;
  event.dataTransfer?.setData("text/plain", "sidebar-icon");
}

function onDrop(event: DragEvent, dropIndex: number): void {
  if (!draggedItem) {
    return;
  }
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
    width="80"
    color="transparent"
    class="border-0 pb-2 pt-0"
    elevation="0"
    floating
    permanent
  >
    <div
      class="d-flex flex-column align-center pt-0 pb-4 fill-height"
      style="width: 100%"
      @mousedown.stop
    >
      <div v-for="(item, index) in topPages" :key="index" class="mb-2 rail-item">
        <span v-if="item.isActive?.()" class="brand-dot rail-item__dot" aria-hidden="true" />
        <v-tooltip :text="item.title" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              :color="item.isActive?.() ? 'primary' : undefined"
              :variant="item.isActive?.() ? 'tonal' : 'text'"
              :data-testid="item.testId"
              @click="item.click"
              class="icon-style"
              width="48"
              height="48"
              draggable="false"
              @dragstart="startDrag($event, item)"
              @drop="onDrop($event, index)"
              @dragover.prevent
            >
              <v-icon :icon="item.icon" size="24" />
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <v-spacer />

      <div v-for="(item, index) in bottomPages" :key="index" class="mb-2 rail-item">
        <span v-if="item.isActive?.()" class="brand-dot rail-item__dot" aria-hidden="true" />
        <v-tooltip :text="item.title" location="right">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              :color="item.isActive?.() ? 'primary' : undefined"
              :variant="item.isActive?.() ? 'tonal' : 'text'"
              :data-testid="item.testId"
              @click="item.click"
              class="icon-style"
              width="48"
              height="48"
              draggable="false"
            >
              <v-badge
                :model-value="(item.badge?.() ?? 0) > 0"
                :content="item.badge?.()"
                color="error"
                max="99"
                :data-testid="`${item.testId}Badge`"
              >
                <v-icon :icon="item.icon" size="24" />
              </v-badge>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.rail-item {
  position: relative;
}

.rail-item__dot {
  position: absolute;
  top: 50%;
  left: -10px;
  transform: translateY(-50%);
}

.icon-style {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-style:hover {
  background: rgba(var(--v-theme-primary), 0.12) !important;
}

:deep(.v-navigation-drawer__content) {
  overflow: visible !important;
}
</style>
