<template>
  <Launcher v-if="infra_store.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="height: 100%; width: 100%; border-radius: 15px"
    @click.right="openMenu"
  >
    <RemoteRenderingView>
      <template #ui>
        <ViewerTreeObjectTree />
        <ViewerContextMenu
          v-if="display_menu"
          :id="menuStore.current_id || id"
          :x="menuStore.menuX"
          :y="menuStore.menuY"
          :containerWidth="containerWidth"
          :containerHeight="containerHeight"
        />
      </template>
    </RemoteRenderingView>
  </v-card>
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import Status from "@ogw_f/utils/status.js";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";

import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";

const infra_store = use_infra_store();
const viewer_store = use_viewer_store();
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

async function openMenu(event) {
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  await get_viewer_id(event.offsetX, event.offsetY);
  menuStore.openMenu(
    id.value,
    event.clientX,
    event.clientY,
    containerWidth.value,
    containerHeight.value
  );
}

function resize() {
  if (cardContainer.value) {
    const { width, height } = useElementSize(cardContainer.value);
    containerWidth.value = width.value;
    containerHeight.value = height.value;
  }
}

watch(
  () => viewer_store.status,
  (value) => {
    if (value === Status.CONNECTED) {
      resize();
    }
  }
);

onMounted(async () => {
  if (viewer_store.status === Status.CONNECTED) {
    resize();
  }
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
