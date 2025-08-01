<template>
  <ClientOnly>
    <div style="position: relative; width: 100%; height: calc(100vh - 75px)">
      <VeaseViewToolbar />
      <slot name="ui"></slot>
      <v-col
        ref="viewer"
        style="
          overflow: hidden;
          position: relative;
          z-index: 0;
          height: 100%;
          width: 100%;
        "
        class="pa-0"
        @click="get_x_y"
        @keydown.esc="viewer_store.toggle_picking_mode(false)"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

const container = useTemplateRef("viewer");
const hybridViewerStore = useHybridViewerStore();
const viewer_store = use_viewer_store();

const { windowWidth, windowHeight } = useWindowSize();
const { width, height } = useElementSize(container);

function get_x_y(event) {
  if (viewer_store.picking_mode.value === true) {
    const { offsetX, offsetY } = event;
    viewer_store.set_picked_point(offsetX, offsetY);
    viewer_call({
      schema: viewer_schemas.opengeodeweb_viewer.viewer.get_point_position,
      params: { x: offsetX, y: offsetY },
    });
  }
}

watch([windowWidth, windowHeight, height, width], () => {
  hybridViewerStore.resize(width.value, height.value);
});

onMounted(async () => {
  if (import.meta.client) {
    await hybridViewerStore.initHybridViewer();
    await nextTick();
    hybridViewerStore.setContainer(container);
  }
});
</script>
