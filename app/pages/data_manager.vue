<script setup lang="ts">
import CrsDialogHost from "@ogw_front/components/CrsDialogHost.vue";
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
import { useCrsStore } from "@ogw_front/stores/crs";

const crsStore = useCrsStore();

// The alignment panel lives in the viewer
watch(
  () => crsStore.showCrsAlign,
  (show) => {
    if (show) {
      void navigateTo("/");
    }
  },
);
</script>

<template>
  <!-- One root: the page receives the layout's classes -->
  <div class="fill-height">
    <DataManagerContent />
    <CrsDialogHost />
  </div>
</template>
