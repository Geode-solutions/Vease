<template>
  <v-container
    class="treeview-container"
    :style="{ width: `${treeviewStore.panelWidth}px` }"
  >
    <v-row
      class="resizable-panel"
      :style="{ width: `${treeviewStore.panelWidth}px` }"
    >
      <v-sheet
        style="max-height: calc(80vh - 100px)"
        class="transparent-treeview scrollbar"
      >
        <v-row>
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
      <div class="resizer" @mousedown="onResizeStart"></div>
    </v-row>
  </v-container>
</template>

<script setup>
const treeviewStore = use_treeview_store();

function handleTreeMenu({ event, itemId }) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  id.value = itemId;
  menuStore.openMenu();
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
  display: inline-block;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  cursor: ew-resize;
  height: 100%;
  background-color: transparent;
  z-index: 10;
}

.resizer:hover {
  background-color: #e7e7e7;
}

.transparent-treeview {
  background-color: transparent;
  margin: 4px 0;
}

.scrollbar {
  overflow-x: hidden;
}

:hover.scrollbar {
  overflow-y: auto;
}

.scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
}
</style>
