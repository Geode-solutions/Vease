<script setup lang="ts">
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import PickButton from "@vease/components/tools/PickButton.vue";
import { useCrs } from "@vease/composables/crs";
import { useCrsAlign } from "@vease/composables/crs_align";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();
const feedbackStore = useFeedbackStore();
const { alignCrs } = useCrs();
const {
  sourcePoints,
  targetPoints,
  pickingActive,
  togglePickMode,
  reset,
  isComplete,
  toCrsPoints,
  toSourceCrsPoints,
  editSourcePoint,
} = useCrsAlign();
const targetCrs = ref<CRSList | undefined>(undefined);
const applying = ref(false);

watch(
  () => UIStore.crsAlignItem,
  () => {
    reset();
    targetCrs.value = undefined;
  },
);

function close(): void {
  reset();
  UIStore.setShowCrsAlign(false);
}

async function apply(): Promise<void> {
  const item = UIStore.crsAlignItem;
  if (!item || !targetCrs.value || !isComplete.value || applying.value) {
    return;
  }
  applying.value = true;
  try {
    await alignCrs(
      item,
      toSourceCrsPoints(),
      toCrsPoints(targetPoints.value),
      targetCrs.value,
    );
    feedbackStore.add_success("Data aligned");
    close();
  } finally {
    applying.value = false;
  }
}
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column h-100 w-100 pa-3 text-white">
    <div class="d-flex align-center mb-2">
      <v-icon start icon="mdi-vector-triangle" size="18" />
      <h2 class="text-subtitle-1 font-weight-bold mb-0">Align {{ UIStore.crsAlignItem?.name }}</h2>
      <v-spacer />
      <v-btn icon size="x-small" variant="text" color="white" @click="close">
        <v-icon size="16">mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-text class="px-0 flex-grow-1 overflow-y-auto">
      <div class="text-caption font-weight-bold text-uppercase opacity-60 mb-1">
        Source points (on data)
      </div>
      <v-row
        v-for="(point, index) in sourcePoints"
        :key="'source-' + index"
        dense
        :data-testid="'crsAlignSource-' + index"
      >
        <v-col v-for="coord in ['x', 'y'] as const" :key="coord" cols="6">
          <v-text-field
            :model-value="point[coord]"
            @update:model-value="(value) => editSourcePoint(index, coord, value)"
            inputmode="decimal"
            variant="outlined"
            color="white"
            density="compact"
            theme="dark"
            base-color="white"
            bg-color="rgba(255, 255, 255, 0.15)"
            hide-details
            :label="coord.toUpperCase()"
          />
        </v-col>
      </v-row>
      <!-- PickButton's root is a tooltip: spacing classes must sit on a wrapper -->
      <div class="mt-3">
        <PickButton :active="pickingActive" @click="togglePickMode" />
      </div>

      <div class="text-caption font-weight-bold text-uppercase opacity-60 mt-4 mb-1">
        Target points
      </div>
      <v-row
        v-for="(point, index) in targetPoints"
        :key="'target-' + index"
        dense
        :data-testid="'crsAlignTarget-' + index"
      >
        <v-col v-for="coord in ['x', 'y']" :key="coord" cols="6">
          <v-text-field
            v-model="point[coord]"
            inputmode="decimal"
            variant="outlined"
            color="white"
            density="compact"
            theme="dark"
            base-color="white"
            bg-color="rgba(255, 255, 255, 0.15)"
            hide-details
            :label="coord.toUpperCase()"
          />
        </v-col>
      </v-row>

      <div class="text-caption font-weight-bold text-uppercase opacity-60 mt-4 mb-1">
        Target CRS
      </div>
      <CrsSelector
        v-if="UIStore.crsAlignItem"
        :key="UIStore.crsAlignItem.id"
        v-model="targetCrs"
        compact
        :geode-object-type="UIStore.crsAlignItem.geode_object_type"
      />
    </v-card-text>

    <v-card-actions class="px-0 pb-0">
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        data-testid="crsAlignApplyButton"
        :disabled="!isComplete || !targetCrs || applying"
        :loading="applying"
        class="text-none rounded-lg font-weight-bold"
        @click="apply"
      >
        <v-icon start>mdi-check-circle-outline</v-icon>
        Apply
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
