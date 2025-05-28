<template>
  <ClientOnly>
    <div style="position: relative; width: 100%; height: calc(100vh - 75px)">
      <view-toolbar />
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
const frontViewerStore = useFrontViewerStore();

const { windowWidth, windowHeight } = useWindowSize();
const { width, height } = useElementSize(container);

watch([windowWidth, windowHeight, height, width], () => {
  frontViewerStore.resize(width.value, height.value);
});

onMounted(async () => {
  if (import.meta.client) {
    console.log("mounted test");
    await frontViewerStore.initFrontViewer();
    await nextTick();
    await frontViewerStore.setContainer(container);
    frontViewerStore.resize(width.value, height.value);
  }
});
</script>
