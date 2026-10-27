<script setup lang="ts">
import CrsDialog from "@vease/components/datamanager/CrsDialog.vue";
import type { DataItem } from "@vease/types/data_item";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useDataStore } from "@ogw_front/stores/data";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

const crsStore = useCrsStore();
const dataStore = useDataStore();
const feedbackStore = useFeedbackStore();
const show = ref(false);
const item = ref<DataItem | undefined>(undefined);

// Vease hosts the CRS dialog: the shared tree and info card may offer CRS edits
crsStore.enableCrsEdit();

watch(
  () => crsStore.crsEditRequest,
  async (id) => {
    if (id === undefined) {
      return;
    }
    try {
      item.value = await dataStore.item(id);
    } catch {
      // The data was deleted since the edit was offered (e.g. by a snackbar)
      crsStore.clearCrsEditRequest();
      return;
    }
    show.value = true;
  },
);

function updateShow(value: boolean): void {
  show.value = value;
  if (!value) {
    crsStore.clearCrsEditRequest();
  }
}
</script>

<template>
  <CrsDialog
    :show="show"
    :item="item"
    @update:show="updateShow"
    @assigned="feedbackStore.add_success('CRS assigned')"
    @converted="feedbackStore.add_success('CRS converted')"
  />
</template>
