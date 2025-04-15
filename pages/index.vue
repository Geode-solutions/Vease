<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="height: 100%; width: 100%; border-radius: 10px"
    @click.right="openMenu"
  >
    <RemoteRenderingView>
      <template #ui>
        <ViewerTreeObject
          @click.right.contextmenu.stop
          @show-menu="handleTreeMenu"
        />
        <ViewerContextMenu
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
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import Status from "@geode/opengeodeweb-front/utils/status.js";
import { useTemplateRef } from "vue";

const infra_store = use_infra_store();
// const viewer_store = use_viewer_store();
// const geode_store = use_geode_store();
const menuStore = useMenuStore();
const dataStyleStore = useDataStyleStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const id = ref("");
const cardContainer = useTemplateRef("cardContainer");

const { display_menu } = storeToRefs(menuStore);

async function get_viewer_id(x, y) {
  const ids = dataStyleStore.selectedObjects;
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
function handleTreeMenu({ event, itemId }) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  id.value = itemId;
  menuStore.openMenu();
}
async function openMenu(event, id) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  await get_viewer_id(event.offsetX, event.offsetY);
  menuStore.openMenu();
}

// watch(
//   infra_store,
//   async (value) => {
//     if (!value.is_sync) return;
//     if (value.status != Status.CREATED) {
//       await infra_store.create_backend();
//       return;
//     }
//     if (!value.microservices_connected) {
//       await infra_store.create_connection();
//     }
//   },
//   { deep: true }
// );

onMounted(async () => {
  console.log("onMounted");
  // if (!viewer_store.is_running) {
  //   await infra_store.create_connexion();
  //   await viewer_store.ws_connect();
  // }
  if (cardContainer.value) {
    const { width, height } = useElementSize(cardContainer.value);
    containerWidth.value = width.value;
    containerHeight.value = height.value;
  }
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
