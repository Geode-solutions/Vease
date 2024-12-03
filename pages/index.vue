<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card style="height: 100%; width: 100%" @click.right="openMenu">
        <RemoteRenderingView>
          <template #ui>
            <TreeObject />
            <ContextMenu
              :x="menuX"
              :y="menuY"
              :containerWidth="containerWidth"
              :containerHeight="containerHeight"
            />
          </template>
        </RemoteRenderingView>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const infra_store = use_infra_store();
const viewer_store = use_viewer_store();
const menuStore = useMenuStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);

function openMenu(event) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  menuStore.openMenu(event.offsetX, event.offsetY);
}

onMounted(async () => {
  await infra_store.create_backend();
  await viewer_store.ws_connect();

  const container = document.querySelector(".v-card");
  const { width, height } = useElementSize(container);
  containerWidth.value = width.value;
  containerHeight.value = height.value;
});

if (!viewer_store.client) {
  await viewer_store.ws_connect();
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>
