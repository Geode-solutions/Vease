<script setup lang="ts">
import CrsDialogHost from "@ogw_front/components/CrsDialogHost.vue";
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
</script>

<template>
  <!-- One root: the page receives the layout's classes -->
  <div class="fill-height">
    <DataManagerContent />
    <CrsDialogHost />
  </div>
</template>
