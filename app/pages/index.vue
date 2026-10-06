<script setup lang="ts">
import { useMenuStore } from "@ogw_front/stores/menu";
import { useViewerContextMenu } from "@ogw_front/composables/viewer_context_menu";

import HybridRenderingView from "@ogw_front/components/HybridRenderingView.vue";
import Launcher from "@ogw_front/components/Launcher.vue";
import ViewerUI from "@ogw_front/components/Viewer/Ui.vue";

const menuStore = useMenuStore();
const cardContainer = useTemplateRef("cardContainer");
const viewerUI = useTemplateRef("viewerUI");

const { display_menu } = storeToRefs(menuStore);
const { containerWidth, containerHeight, openTreeMenu, openViewerMenu } = useViewerContextMenu(
  cardContainer,
  viewerUI,
);
</script>

<template>
  <InfraConnected>
    <div ref="cardContainer" class="w-100 h-100 fill-height" @contextmenu.prevent="openViewerMenu">
      <HybridRenderingView>
        <template #ui>
          <ViewerUI
            ref="viewerUI"
            class="viewer-ui-layer"
            :display-menu="display_menu"
            :container-width="containerWidth"
            :container-height="containerHeight"
            @show-menu="openTreeMenu"
          />
        </template>
      </HybridRenderingView>
    </div>
  </InfraConnected>
</template>

<style scoped>
:deep(.viewer-ui-layer),
:deep(.viewer-ui-layer .v-navigation-drawer) {
  z-index: 5 !important;
}
</style>
