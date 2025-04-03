<template>
  <Launcher
    v-if="infra_store.is_cloud && !infra_store.microservices_connected"
  />
  <v-card
    v-else
    ref="cardContainer"
    style="height: 100%; width: 100%; border-radius: 10px"
    @click.right="openMenu"
  >
    <RemoteRenderingView>
      <template #ui>
        <ViewerTreeObject @show-menu="handleTreeMenu" />
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
import { useTemplateRef } from "vue";

const infra_store = use_infra_store();
const viewer_store = use_viewer_store();
const geode_store = use_geode_store();
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
function handleTreeMenu({ event, id: itemId }) {
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

watch(
  infra_store,
  async (value, oldValue) => {
    console.log("WATCH infra_store.is_sync value", value.is_sync);
    console.log("WATCH infra_store.is_sync oldValue", oldValue.is_sync);
    console.log("WATCH infra_store.status value", value.status);
    console.log("WATCH infra_store.status oldValue", oldValue.status);

    if (value.is_sync && !oldValue.is_sync) {
      console.log("infra_store SYNCED !");

      await infra_store.create_backend();
      await viewer_store.connect();
    }
    // // if (oldValue.is_sync) {
    // //   console.log("ALREADY SYNC");
    // //   return;
    // // }
    // console.log("GO FOR LAUNCH");
    // if (!value.is_connexion_launched) {
    //   // not created
    //   console.log("CREATE BACKEND");
    //   await infra_store.create_backend();
    //   viewer_store.connect();
    // }
    // not connected
  },
  { deep: true }
);

onMounted(async () => {
  console.log("onMounted");
  console.log("infra_store.is_sync", infra_store.is_sync);
  console.log("viewer_store.is_sync", viewer_store.is_sync);
  console.log("geode_store.is_sync", geode_store.is_sync);
  if (infra_store.is_sync) {
    // if (!infra_store.status ) {
    console.log("CREATE BACKEND");
    await infra_store.create_backend();
    // }
    await viewer_store.connect();
  }
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
