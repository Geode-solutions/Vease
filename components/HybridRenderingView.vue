<template>
  <ClientOnly>
    <div
      ref="toto"
      style="position: relative; width: 100%; height: calc(100vh - 75px)"
    >
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
const toto = useTemplateRef("toto");
const container = useTemplateRef("viewer");
const hybridViewerStore = useHybridViewerStore();

const { windowWidth, windowHeight } = useWindowSize();
const { width, height } = useElementSize(container);

watch([windowWidth, windowHeight, height, width], () => {
  console.log("watch resize", width.value, height.value);
  hybridViewerStore.resize(width.value, height.value);
});

onMounted(async () => {
  if (import.meta.client) {
    await hybridViewerStore.initHybridViewer();
    await nextTick();
    await hybridViewerStore.setContainer(container);
  }
});

const { isScrolling } = useScroll(toto);

// addEventListener("scroll", (event) => {
//   console.log("scroll", event);
// });
watch(isScrolling, (value) => {
  console.log("isScrolling", value);
  // if (!value) {
  //   imageStyle.opacity = 0;
  // } else {
  //   syncRemoteCamera();
  // }
});
</script>
