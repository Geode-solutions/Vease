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
const container = useTemplateRef("viewer");
const hybridViewerStore = useHybridViewerStore();

const { windowWidth, windowHeight } = useWindowSize();
const { width, height } = useElementSize(container);

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
