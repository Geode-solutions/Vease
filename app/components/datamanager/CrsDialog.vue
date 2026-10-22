<script setup lang="ts">
import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { useBackStore } from "@ogw_front/stores/back";
import { useCrs } from "@vease/composables/crs";
import { useUIStore } from "@vease/stores/ui";

const { show = false, item = undefined } = defineProps<{
  show?: boolean;
  item?: DataItem;
}>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  assigned: [];
  converted: [];
}>();

const backStore = useBackStore();
const currentCrs = ref("");
const selectedCrs = ref<CRSList | undefined>(undefined);
const assigning = ref(false);
const loadingCurrentCrs = ref(false);
const { convertCrs } = useCrs();
const UIStore = useUIStore();
const isGeographic = ref(false);
const crsKnown = ref(false);
const mode = ref<"assign" | "convert" | "align">("assign");
const converting = ref(false);

async function fetchCurrentCrs(): Promise<void> {
  currentCrs.value = "";
  selectedCrs.value = undefined;
  mode.value = "assign";
  isGeographic.value = false;
  crsKnown.value = false;
  if (!item) {
    return;
  }
  loadingCurrentCrs.value = true;
  try {
    await backStore.request(
      {
        schema: back_schemas.opengeodeweb_back.crs.active,
        params: { id: item.id },
      },
      {
        // Without geographic info, the active CRS is OpenGeode's default local one ("points")
        response_function: ({ crs_info }) => {
          isGeographic.value = crs_info !== undefined;
          crsKnown.value = true;
          currentCrs.value = crs_info
            ? `${crs_info.authority}:${crs_info.code} — ${crs_info.name}`
            : "None (local coordinates)";
        },
      },
    );
  } finally {
    loadingCurrentCrs.value = false;
  }
}

watch(
  () => show,
  async (value) => {
    if (value) {
      await fetchCurrentCrs();
    }
  },
  { immediate: true },
);

async function handleAssign(): Promise<void> {
  if (!item || !selectedCrs.value || assigning.value) {
    return;
  }
  assigning.value = true;
  try {
    await backStore.request(
      {
        schema: back_schemas.opengeodeweb_back.crs.assign_geographic,
        params: { id: item.id, ...selectedCrs.value },
      },
      {
        response_function: () => {
          emit("assigned");
          emit("update:show", false);
        },
      },
    );
  } finally {
    assigning.value = false;
  }
}

async function handleConvert(): Promise<void> {
  if (!item || !selectedCrs.value || converting.value) {
    return;
  }
  converting.value = true;
  try {
    await convertCrs(item, selectedCrs.value);
    emit("converted");
    emit("update:show", false);
  } finally {
    converting.value = false;
  }
}

// Picking only works in the viewer: the alignment continues in its drawer
async function startAlignment(): Promise<void> {
  if (!item) {
    return;
  }
  emit("update:show", false);
  await navigateTo("/");
  UIStore.openCrsAlign(item);
}
</script>

<template>
  <v-dialog
    :model-value="show"
    scrollable
    @update:model-value="emit('update:show', $event)"
    max-width="800"
  >
    <GlassCard variant="panel" padding="pa-8" :width="800">
      <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center text-white">
        <v-icon icon="mdi-earth" class="mr-3 text-h4" color="white"></v-icon>
        Coordinate Reference System
      </v-card-title>

      <v-card-subtitle class="ma-0 text-white opacity-80">
        Current CRS:
        <v-progress-circular
          v-if="loadingCurrentCrs"
          data-testid="crsCurrentLoading"
          indeterminate
          size="16"
          width="2"
        />
        <span v-else data-testid="crsCurrentValue">{{ currentCrs }}</span>
      </v-card-subtitle>

      <!-- flex-shrink-0: the scrollable dialog card would otherwise squash the toggle to 0 height -->
      <div class="mt-4 flex-shrink-0">
        <v-btn-toggle v-model="mode" mandatory density="compact" color="white">
          <v-btn value="assign" data-testid="crsModeAssign" class="text-none">Assign</v-btn>
          <v-btn
            v-if="crsKnown && isGeographic"
            value="convert"
            data-testid="crsModeConvert"
            class="text-none"
          >
            Convert
          </v-btn>
          <v-btn v-else-if="crsKnown" value="align" data-testid="crsModeAlign" class="text-none">
            Align (3 points)
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-card-text class="pt-8 px-0">
        <CrsSelector
          v-if="item && mode !== 'align'"
          :key="item.id"
          v-model="selectedCrs"
          :geode-object-type="item.geode_object_type"
        />
        <div v-if="mode === 'align'" class="text-white">
          <p class="mb-4">
            Pick 3 points on the data and type their real coordinates in the target CRS.
          </p>
          <v-btn
            color="primary"
            variant="flat"
            data-testid="crsStartAlignButton"
            class="text-none rounded-lg"
            @click="startAlignment"
          >
            <v-icon start>mdi-vector-triangle</v-icon>
            Start alignment
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions class="px-0 pb-0 mt-4">
        <v-btn
          variant="text"
          color="white"
          size="large"
          @click="emit('update:show', false)"
          class="text-none rounded-lg"
        >
          <v-icon start>mdi-close-circle-outline</v-icon>
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="mode === 'assign'"
          color="primary"
          size="large"
          variant="flat"
          data-testid="crsAssignButton"
          :disabled="!selectedCrs || assigning"
          :loading="assigning"
          @click="handleAssign"
          class="text-none rounded-lg font-weight-bold"
          elevation="4"
        >
          <v-icon start>mdi-check-circle-outline</v-icon>
          Assign
        </v-btn>
        <v-btn
          v-if="mode === 'convert'"
          color="primary"
          size="large"
          variant="flat"
          data-testid="crsConvertButton"
          :disabled="!selectedCrs || converting"
          :loading="converting"
          @click="handleConvert"
          class="text-none rounded-lg font-weight-bold"
          elevation="4"
        >
          <v-icon start>mdi-swap-horizontal</v-icon>
          Convert
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
