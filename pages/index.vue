<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card
        ref="cardContainer"
        style="height: 100%; width: 100%"
        @click.right="openMenu"
      >
        <RemoteRenderingView>
          <template #ui>
            <TreeObject />
            <ContextMenu
              v-if="display_menu"
              :id="id"
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
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const infra_store = use_infra_store();
const viewer_store = use_viewer_store();
const menuStore = useMenuStore();
const dataStyleStore = useDataStyleStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const id = ref("");
const cardContainer = ref(null);

const { display_menu } = storeToRefs(menuStore);

async function get_id(x, y) {
  const ids = dataStyleStore.selectedObjects;
  console.log("ids", ids);
  await viewer_call(
    {
      schema: viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      params: { x, y, ids },
    },
    {
      response_function: (response) => {
        const array_ids = response.array_ids;
        id.value = array_ids[0];
      },
    }
  );
}

async function openMenu(event) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  await get_id(event.offsetX, event.offsetY);
  menuStore.openMenu();
}

onMounted(async () => {
  await infra_store.create_backend();
  await viewer_store.ws_connect();

  if (cardContainer.value) {
    const { width, height } = useElementSize(cardContainer.value);
    containerWidth.value = width.value;
    containerHeight.value = height.value;
  }

  if (!viewer_store.client) {
    await viewer_store.ws_connect();
  }
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
