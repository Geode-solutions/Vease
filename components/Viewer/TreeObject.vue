<template>
  <v-container class="treeview-container" :style="{ width: `${panelWidth}px` }">
    <v-row>
      <div class="resizable-panel" :style="{ width: `${panelWidth}px` }">
        <v-sheet
          style="max-height: calc(80vh - 100px)"
          class="transparent-treeview scrollbar"
        >
          <v-treeview
            v-model:selected="selection"
            :items="treeviewStore.items"
            return-object
            class="transparent-treeview"
            item-value="id"
            select-strategy="classic"
            selectable
            @contextmenu="onRightClick"
          />
        </v-sheet>
      </div>
      <div class="resizer" @mousedown="onResizeStart"></div>
    </v-row>
  </v-container>
</template>

<script setup>
const treeviewStore = use_treeview_store();
const dataStyleStore = useDataStyleStore();
const { selection } = toRefs(treeviewStore);

const panelWidth = ref(300);
const isResizing = ref(false);
const startWidth = ref(0);
const { x: mouseX } = useMouse();
const idCardStore = useIdCardStore();

function onRightClick(event, item) {
  event.preventDefault();
  return item.value;
}

function compareSelections(current, previous) {
  const added = current.filter((item) => !previous.includes(item));
  const removed = previous.filter((item) => !current.includes(item));
  return { added, removed };
}

watch(
  selection,
  (current, previous) => {
    if (!previous) previous = [];
    const { added, removed } = compareSelections(current, previous);

    added.forEach((item) => dataStyleStore.setVisibility(item.id, true));
    removed.forEach((item) => dataStyleStore.setVisibility(item.id, false));
  },
  { immediate: true }
);

function onResizeStart(event) {
  isResizing.value = true;
  startWidth.value = panelWidth.value;

  const stopResize = () => (isResizing.value = false);

  const resize = () => {
    if (isResizing.value) {
      const deltaX = mouseX.value - event.clientX;
      const newWidth = startWidth.value + deltaX;
      panelWidth.value = Math.max(150, Math.min(newWidth, window.innerWidth));
    }
  };

  useEventListener(document, "mousemove", resize);
  useEventListener(document, "mouseup", stopResize);
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
}

.resizer {
  width: 5px;
  cursor: ew-resize;
  height: 100%;
  background-color: transparent;
}

.resizer:hover {
  background-color: #e7e7e7;
}

.resizer:active {
  background-color: #e7e7e7;
}

.transparent-treeview {
  background-color: transparent;
  margin: 4px 0;
}

.scrollbar {
  overflow-y: hidden;
}

:hover.scrollbar {
  overflow-y: auto;
}

.scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #8d8b8b;
  border-radius: 10px;
}
</style>
