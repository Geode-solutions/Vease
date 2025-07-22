<template>
  <v-container
    class="treeview-container"
    :style="{ width: `${treeviewStore.panelWidth}px` }"
  >
    <v-row
      class="resizable-panel"
      :style="{ width: `${treeviewStore.panelWidth}px` }"
    >
      <div class="scrollable-wrapper">
        <v-sheet
          style="max-height: calc(90vh)"
          class="transparent-treeview scrollbar-hover"
        >
          <v-row v-if="treeviewStore.items.length > 0">
            <v-col>
              <ViewerBreadCrumb
                :selectedTree="selectedTree"
                :treeOptions="treeOptions"
                @update:selectedTree="selectedTree = $event"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ViewerTreeObject
                v-if="!treeviewStore.isAdditionnalTreeDisplayed"
                @show-menu="handleTreeMenu"
              />
              <ViewerTreeComponent
                v-else
                @show-menu="handleTreeMenu"
                :id="treeviewStore.model_id"
              />
            </v-col>
          </v-row>
        </v-sheet>
      </div>
      <div class="resizer" @mousedown="onResizeStart"></div>
    </v-row>
  </v-container>
</template>

<script setup>
const treeviewStore = use_treeview_store();
const menuStore = useMenuStore();
const cardContainer = useTemplateRef("cardContainer");
const containerWidth = ref(window.innerWidth);
const containerHeight = ref(window.innerHeight);

const menuX = ref(0);
const menuY = ref(0);
const id = ref(null);

const emit = defineEmits(["show-menu", "position-menu"]);

function handleTreeMenu({ event, itemId }) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  id.value = itemId;

  menuStore.openMenu(itemId, event.clientX, event.clientY);
}

function onResizeStart(event) {
  const startWidth = treeviewStore.panelWidth;
  const startX = event.clientX;

  const resize = (e) => {
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(
      150,
      Math.min(startWidth + deltaX, window.innerWidth)
    );
    treeviewStore.setPanelWidth(newWidth);
    document.body.style.userSelect = "none";
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.userSelect = "";
  };

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

onMounted(() => {
  containerWidth.value = window.innerWidth;
  containerHeight.value = window.innerHeight;

  window.addEventListener("resize", () => {
    containerWidth.value = window.innerWidth;
    containerHeight.value = window.innerHeight;
  });
});

onUnmounted(() => {
  window.removeEventListener("resize");
});
</script>

<style scoped>
.treeview-container {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  background-color: transparent;
  border-radius: 16px;
  padding: 8px;
  display: flex;
  box-sizing: border-box;
}

.resizable-panel {
  display: flex;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.scrollable-wrapper {
  overflow-y: auto;
  padding-right: 6px;
  flex: 1;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
  z-index: 15;
}

.resizer:hover {
  background-color: #999;
}

.resizer:active {
  background-color: #666;
}

.transparent-treeview {
  background-color: transparent;
  margin: 4px 0;
}

.scrollbar-hover {
  overflow-x: hidden;
}

.scrollbar-hover::-webkit-scrollbar {
  width: 5px;
}

.scrollbar-hover::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.scrollbar-hover:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
</style>
