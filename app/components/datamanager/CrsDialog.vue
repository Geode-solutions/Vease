<script setup lang="ts">
import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { useBackStore } from "@ogw_front/stores/back";

const { show = false, item = undefined } = defineProps<{
  show?: boolean;
  item?: DataItem;
}>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  assigned: [];
}>();

const backStore = useBackStore();
const currentCrs = ref("");
const selectedCrs = ref<CRSList | undefined>(undefined);
const assigning = ref(false);
const loadingCurrentCrs = ref(false);

async function fetchCurrentCrs(): Promise<void> {
  currentCrs.value = "";
  selectedCrs.value = undefined;
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
        response_function: ({ crs_name, crs_info }) => {
          currentCrs.value = crs_info
            ? `${crs_info.authority}:${crs_info.code} — ${crs_info.name}`
            : crs_name;
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
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="emit('update:show', $event)" max-width="800">
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

      <v-card-text class="pt-8 px-0">
        <CrsSelector
          v-if="item"
          :key="item.id"
          v-model="selectedCrs"
          :geode-object-type="item.geode_object_type"
        />
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
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
