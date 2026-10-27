<script setup lang="ts">
import { type AlignResult, useCrs } from "@vease/composables/crs";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import PickButton from "@vease/components/tools/PickButton.vue";
import { useCrsAlign } from "@vease/composables/crs_align";
import { useDataStore } from "@ogw_front/stores/data";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUIStore } from "@vease/stores/ui";

const UIStore = useUIStore();
const feedbackStore = useFeedbackStore();
const { alignCrs } = useCrs();
const {
  mode,
  setMode,
  visibleSourcePoints,
  visibleTargetPoints,
  pickingActive,
  togglePickMode,
  reset,
  isComplete,
  toSourceCrsPoints,
  toTargetCrsPoints,
  editSourcePoint,
} = useCrsAlign();

const MODES = [
  { value: "similarity", label: "Without distortion" },
  { value: "affine", label: "Affine (3 points)" },
] as const;
const targetCrs = ref<CRSList | undefined>(undefined);
const applying = ref(false);
const items = useDataStore().refAllItems();
const linkedIds = ref<string[]>([]);

function sameCrs(first: CRSList | undefined, second: CRSList | undefined): boolean {
  return first?.authority === second?.authority && first?.code === second?.code;
}

// Only data in the same CRS state can share the local frame of the aligned item
const linkCandidates = computed(() => {
  const item = UIStore.crsAlignItem;
  if (!item) {
    return [];
  }
  return items.value.filter((other) => other.id !== item.id && sameCrs(other.crs, item.crs));
});

watch(
  () => UIStore.crsAlignItem,
  () => {
    reset();
    targetCrs.value = undefined;
    linkedIds.value = [];
  },
);

function successMessage({ scale, rotation }: AlignResult, count: number): string {
  const aligned = count > 1 ? `Data aligned (${count} items)` : "Data aligned";
  if (scale === undefined || rotation === undefined) {
    return aligned;
  }
  return `${aligned}: scale ×${scale.toFixed(2)}, rotation ${Math.round(rotation)}°`;
}

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
    const linkedItems = linkCandidates.value.filter(({ id }) => linkedIds.value.includes(id));
    const result = await alignCrs(item, targetCrs.value, {
      sourcePoints: toSourceCrsPoints(),
      targetPoints: toTargetCrsPoints(),
      mode: mode.value,
      linkedItems,
    });
    feedbackStore.add_success(successMessage(result, 1 + linkedItems.length));
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
      <!-- One line: a long data name is truncated, the full name is in the tooltip -->
      <h2 class="text-subtitle-1 font-weight-bold mb-0 text-truncate" style="min-width: 0">
        Align {{ UIStore.crsAlignItem?.name }}
        <v-tooltip activator="parent" location="bottom">
          Align {{ UIStore.crsAlignItem?.name }}
        </v-tooltip>
      </h2>
      <v-spacer />
      <v-btn icon size="x-small" variant="text" color="white" @click="close">
        <v-icon size="16">mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-text class="px-0 flex-grow-1 overflow-y-auto">
      <v-btn-toggle
        :model-value="mode"
        mandatory
        density="compact"
        variant="outlined"
        color="white"
        divided
        class="mb-3 w-100"
        data-testid="crsAlignMode"
        @update:model-value="setMode"
      >
        <v-btn
          v-for="option in MODES"
          :key="option.value"
          :value="option.value"
          :data-testid="'crsAlignMode-' + option.value"
          class="text-none flex-grow-1"
        >
          {{ option.label }}
        </v-btn>
      </v-btn-toggle>
      <!-- Next to the mode: what gets aligned must stay visible without scrolling -->
      <v-select
        v-if="linkCandidates.length > 0"
        v-model="linkedIds"
        :items="linkCandidates"
        item-title="name"
        item-value="id"
        label="Apply also to"
        multiple
        chips
        closable-chips
        variant="outlined"
        color="white"
        density="compact"
        theme="dark"
        base-color="white"
        bg-color="rgba(255, 255, 255, 0.15)"
        hide-details
        class="mb-3"
        data-testid="crsAlignLinked"
      />
      <div class="text-caption font-weight-bold text-uppercase opacity-60 mb-1">
        Source points (on data)
      </div>
      <v-row
        v-for="(point, index) in visibleSourcePoints"
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
        v-for="(point, index) in visibleTargetPoints"
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
