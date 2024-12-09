<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card style="height: 100%; width: 100%" @click.right="openMenu">
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
const treeview_store = use_treeview_store();
const menuStore = useMenuStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);

const id = ref("");

const { display_menu } = storeToRefs(menuStore);

watch(display_menu, (value) => {
  console.log("FROM INDEX WATCH", value);
});
watch(
  () => menuStore.display_menu, (value) => {
  console.log("FROM INDEX WATCH 2 ", value);
});
async function get_id(x, y) {
  const ids = treeview_store.get_ids();
  await viewer_call(
    {
      schema: viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      params: { x, y, ids },
    },
    {
      response_function: (response) => {
        console.log("response", response);
        const array_ids = response.array_ids;
        console.log("array_ids", array_ids);
        id.value = array_ids[0];
        console.log("id", id.value);
      },
    }
  );
}

async function openMenu(event) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  await get_id(event.offsetX, event.offsetY);
  menuStore.openMenu();
  console.log("openMenu", menuStore.display_menu);
}

onMounted(async () => {
  await infra_store.create_backend();
  await viewer_store.ws_connect();

  const container = document.querySelector(".v-card");
  const { width, height } = useElementSize(container);
  containerWidth.value = width.value;
  containerHeight.value = height.value;
  console.log("containerWidth", containerWidth.value, containerHeight.value);
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
