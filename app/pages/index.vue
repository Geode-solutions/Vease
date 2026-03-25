<script setup>
import HybridRenderingView from "@ogw_front/components/HybridRenderingView";
import Launcher from "@ogw_front/components/Launcher";
import { Status } from "@ogw_front/utils/status";
import { useDataStore } from "@ogw_front/stores/data";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useMenuStore } from "@ogw_front/stores/menu";
import { useViewerStore } from "@ogw_front/stores/viewer";
import ViewerUI from "@ogw_front/components/Viewer/UI";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

const infraStore = useInfraStore();
const viewerStore = useViewerStore();
const menuStore = useMenuStore();
const dataStore = useDataStore();
const dataStyleStore = useDataStyleStore();

const id = ref("");
const containerWidth = ref(0);
const containerHeight = ref(0);
const cardContainer = useTemplateRef("cardContainer");

const { display_menu } = storeToRefs(menuStore);

async function get_viewer_id(x, y) {
  const ids = Object.keys(dataStyleStore.styles);
  await viewerStore.request(
    viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
    { x, y, ids },
    {
      response_function: (response) => {
        const { array_ids } = response;
        const [first_id] = array_ids;
        id.value = first_id;
      },
    },
  );
}

async function handleTreeMenu({ event, itemId }) {
  const rect = cardContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const yUI = event.clientY - rect.top;

  const item = await dataStore.item(itemId);

  menuStore.openMenu(
    itemId,
    x,
    yUI,
    containerWidth.value,
    containerHeight.value,
    rect.top,
    rect.left,
    item,
  );
}

async function openMenu(event) {
  const rect = cardContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const yPicking = containerHeight.value - (event.clientY - rect.top);
  const yUI = event.clientY - rect.top;

  await get_viewer_id(x, yPicking);
  const item = await dataStore.item(id.value);

  menuStore.openMenu(
    id.value,
    x,
    yUI,
    containerWidth.value,
    containerHeight.value,
    rect.top,
    rect.left,
    item,
  );
}

const { width: elWidth, height: elHeight } = useElementSize(cardContainer);

watch([elWidth, elHeight], ([width, height]) => {
  containerWidth.value = width;
  containerHeight.value = height;
});
</script>

<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <div v-else ref="cardContainer" class="w-100 h-100 fill-height" @contextmenu.prevent="openMenu">
    <HybridRenderingView>
      <template #ui>
        <ViewerUI
          :id="id"
          :display-menu="display_menu"
          :menu-store="menuStore"
          :container-width="containerWidth"
          :container-height="containerHeight"
          @show-menu="handleTreeMenu"
        />
      </template>
    </HybridRenderingView>
  </div>
</template>
