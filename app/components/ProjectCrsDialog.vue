<script setup lang="ts">
import type { CRS } from "@geode/opengeodeweb-back/schema_types";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { formatCrs } from "@ogw_front/utils/crs";
import { useCrs } from "@vease/composables/crs";
import { useCrsShortlist } from "@vease/composables/crs_shortlist";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useProjectCrs } from "@vease/composables/project_crs";

// The geographic CRS list is the same for every data type
const LIST_TYPE = "PointSet3D";

const { show = false } = defineProps<{ show?: boolean }>();
const emit = defineEmits<{ "update:show": [value: boolean]; changed: [] }>();

const crsStore = useCrsStore();
const { changeProjectCrs } = useCrs();
const { adoptProjectCrs } = useProjectCrs();
const { favorites, recent, toggleFavorite, recordUse } = useCrsShortlist();
const selectedCrs = ref<CRS | undefined>(undefined);
const changing = ref(false);

watch(
  () => show,
  (value) => {
    if (value) {
      selectedCrs.value = undefined;
    }
  },
);

async function apply(): Promise<void> {
  const crs = selectedCrs.value;
  if (!crs || changing.value) {
    return;
  }
  changing.value = true;
  try {
    await changeProjectCrs(crs);
    await adoptProjectCrs(crs);
    recordUse(crs);
    emit("changed");
    emit("update:show", false);
  } catch {
    // The request feedback already shows the error: the dialog stays open to pick another CRS
  } finally {
    changing.value = false;
  }
}
</script>

<template>
  <v-dialog
    :model-value="show"
    scrollable
    max-width="800"
    @update:model-value="emit('update:show', $event)"
  >
    <GlassCard variant="panel" padding="pa-8" :width="800">
      <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center">
        <v-icon icon="ph-globe-hemisphere-west" class="mr-3 text-h4" color="primary" />
        Project CRS
      </v-card-title>
      <v-card-subtitle class="ma-0">
        Current CRS:
        <span data-testid="projectCrsCurrent">{{ formatCrs(crsStore.projectCrs) }}</span>
      </v-card-subtitle>
      <v-card-text class="pt-8 px-0">
        <p class="text-medium-emphasis mb-4">
          Every georeferenced data is converted to the new CRS.
        </p>
        <CrsSelector
          v-model="selectedCrs"
          :geode-object-type="LIST_TYPE"
          :favorites="favorites"
          :recent="recent"
          @toggle-favorite="toggleFavorite"
        />
      </v-card-text>
      <v-card-actions class="px-0 pb-0 mt-4">
        <v-btn
          variant="text"
          color="primary"
          size="large"
          class="text-none rounded-pill"
          @click="emit('update:show', false)"
        >
          <v-icon start>ph-x-circle</v-icon>
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="accent"
          size="large"
          variant="flat"
          data-testid="projectCrsApply"
          :disabled="!selectedCrs || changing"
          :loading="changing"
          class="text-none rounded-pill font-weight-bold"
          @click="apply"
        >
          <v-icon start>ph-arrows-left-right</v-icon>
          Change project CRS
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
