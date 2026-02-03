<script setup>
  import HybridRenderingView from "@ogw_front/components/HybridRenderingView"
  import Launcher from "@ogw_front/components/Launcher"
  import Status from "@ogw_front/utils/status"
  import ViewerContextMenu from "@ogw_front/components/Viewer/ContextMenu"
  import ViewerTreeObjectTree from "@ogw_front/components/Viewer/Tree/ObjectTree"
  import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json"

  import { useDataStore } from "@ogw_front/stores/data"
  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useGeodeStore } from "@ogw_front/stores/geode"
  import { useInfraStore } from "@ogw_front/stores/infra"
  import { useMenuStore } from "@ogw_front/stores/menu"
  import { useViewerStore } from "@ogw_front/stores/viewer"

  const { query } = useRoute()
  if (query.geode_port) {
    console.log(
      "Modifying geode port from query parameters to",
      query.geode_port,
    )
    const geodeStore = useGeodeStore()
    geodeStore.$patch({ default_local_port: query.geode_port })
  }
  if (query.viewer_port) {
    console.log(
      "Modifying viewer port from query parameters to",
      query.viewer_port,
    )
    const viewerStore = useViewerStore()
    viewerStore.$patch({ default_local_port: query.viewer_port })
  }

  const infraStore = useInfraStore()
  const viewerStore = useViewerStore()
  const menuStore = useMenuStore()
  const dataStore = useDataStore()
  const dataStyleStore = useDataStyleStore()

  const id = ref("")
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const cardContainer = useTemplateRef("cardContainer")

  const { display_menu } = storeToRefs(menuStore)

  async function get_viewer_id(x, y) {
    const ids = Object.keys(dataStyleStore.styles)
    await viewerStore.request(
      viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      { x, y, ids },
      {
        response_function: (response) => {
          const { array_ids } = response
          const [first_id] = array_ids
          id.value = first_id
        },
      },
    )
  }

  async function handleTreeMenu({ event, itemId }) {
    const rect = cardContainer.value.$el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const yUI = event.clientY - rect.top

    const item = dataStore.getItem(itemId)

    menuStore.openMenu(
      itemId,
      x,
      yUI,
      containerWidth.value,
      containerHeight.value,
      rect.top,
      rect.left,
      item.value,
    )
  }

  async function openMenu(event) {
    const rect = cardContainer.value.$el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const yPicking = containerHeight.value - (event.clientY - rect.top)
    const yUI = event.clientY - rect.top

    await get_viewer_id(x, yPicking)
    const item = dataStore.getItem(id.value)

    menuStore.openMenu(
      id.value,
      x,
      yUI,
      containerWidth.value,
      containerHeight.value,
      rect.top,
      rect.left,
      item.value,
    )
  }

  const { width: elWidth, height: elHeight } = useElementSize(cardContainer)

  watch([elWidth, elHeight], ([width, height]) => {
    containerWidth.value = width
    containerHeight.value = height
  })
</script>

<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="width: 100%; height: calc(100vh - 75px); border-radius: 15px"
    @contextmenu.prevent="openMenu"
  >
    <HybridRenderingView>
      <template #ui>
        <ViewerTreeObjectTree @show-menu="handleTreeMenu" />
        <ViewerContextMenu
          v-if="display_menu"
          :id="menuStore.current_id || id"
          :x="menuStore.menuX"
          :y="menuStore.menuY"
          :containerWidth="containerWidth"
          :containerHeight="containerHeight"
        />
      </template>
    </HybridRenderingView>
  </v-card>
</template>

<style>
  html {
    overflow-y: auto;
  }
</style>
