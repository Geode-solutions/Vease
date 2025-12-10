<template>
  <Launcher v-if="infraStore.status != Status.CREATED" />
  <v-card
    v-else
    ref="cardContainer"
    style="width: 100%; height: calc(100vh - 75px); border-radius: 15px"
    @click.right="openMenu"
  >
    <HybridRenderingView>
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
    </HybridRenderingView>
  </v-card>
</template>

<script setup>
  import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json"
  import HybridRenderingView from "@ogw_front/components/HybridRenderingView"
  import Launcher from "@ogw_front/components/Launcher"
  import ViewerTreeObjectTree from "@ogw_front/components/Viewer/Tree/ObjectTree"
  import ViewerContextMenu from "@ogw_front/components/Viewer/ContextMenu"
  import Status from "@ogw_front/utils/status
  import { useInfraStore } from "@ogw_front/stores/infra"
  import { useGeodeStore } from "@ogw_front/stores/geode"
  import { useViewerStore } from "@ogw_front/stores/viewer"
  import { useDataStyleStore } from "@ogw_front/stores/data_style"
  import { useMenuStore } from "@ogw_front/stores/menu"

  console.log("Status", Status)

  const query = useRoute().query
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

  console.log("test", import.meta.client)
  console.log("infraStore.status", infraStore.status)

  const viewerStore = useViewerStore()
  const menuStore = useMenuStore()
  const dataStyleStore = useDataStyleStore()

  const menuX = ref(0)
  const menuY = ref(0)
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const id = ref("")
  const cardContainer = useTemplateRef("cardContainer")

  const { display_menu } = storeToRefs(menuStore)

  async function get_viewer_id(x, y) {
    const ids = dataStyleStore.selectedObjects
    await viewerStore.request(
      viewer_schemas.opengeodeweb_viewer.viewer.picked_ids,
      { x, y, ids },
      {
        response_function: (response) => {
          const array_ids = response.array_ids
          id.value = array_ids[0]
        },
      },
    )
  }

  async function openMenu(event) {
    menuX.value = event.clientX
    menuY.value = event.clientY

    await get_viewer_id(event.offsetX, event.offsetY)
    menuStore.openMenu(
      id.value,
      event.clientX,
      event.clientY,
      containerWidth.value,
      containerHeight.value,
    )
  }

  function resize() {
    if (cardContainer.value) {
      const { width, height } = useElementSize(cardContainer.value)
      containerWidth.value = width.value
      containerHeight.value = height.value
    }
  }

  watch(
    () => viewerStore.status,
    (value) => {
      if (value === Status.CONNECTED) {
        resize()
      }
    },
  )

  onMounted(async () => {
    if (viewerStore.status === Status.CONNECTED) {
      resize()
    }
  })
</script>

<style>
  html {
    overflow-y: auto;
  }
</style>
