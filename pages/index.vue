<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card style="height: 100%; width: 100%" @click.right="openMenu">
        <RemoteRenderingView>
          <template #ui>
            <TreeObject />
            <ContextMenu
              v-if="menuStore.display_menu"
              object_type="mesh"
              geode_object="PolygonalSurface3D"
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
const treeview_store = use_treeview_store();
const menuStore = useMenuStore();

const menuX = ref(0);
const menuY = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);

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
        const id = array_ids[0];
        return id;
      },
    }
  );
}

function openMenu(event) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  // const id = get_id(event.offsetX, event.offsetY);
  const id = "toto";
  // const { object_type, geode_object } = treeview_store.idMetaData(id);
  const object_type = "mesh";
  const geode_object = "PolygonalSurface3D";
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
