<script setup lang="ts">
import {
  type AssignResponse,
  buildAssignedEntries,
  plausibleEntries,
  useImplausibleWarning,
} from "@vease/composables/crs_assign";
import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { formatCrs, formatCrsCode } from "@ogw_front/utils/crs";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { useBackStore } from "@ogw_front/stores/back";
import { useCrs } from "@vease/composables/crs";
import { useCrsLinkCandidates } from "@vease/composables/crs_link";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useLiveDataItem } from "@ogw_front/composables/live_data_item";
import { useUIStore } from "@vease/stores/ui";

const { show = false, itemId = undefined } = defineProps<{
  show?: boolean;
  itemId?: string;
}>();

// Read live by its id: the stored CRS shown and the candidates follow the changes
const liveItem = useLiveDataItem(() => itemId);
// The live query starts with an empty placeholder: the item is ready once it is the asked one
const item = computed(() => (liveItem.value?.data_id === itemId ? liveItem.value : undefined));

const emit = defineEmits<{
  "update:show": [value: boolean];
  assigned: [];
  converted: [];
}>();

const backStore = useBackStore();
const crsStore = useCrsStore();
const dataStore = useDataStore();
const currentCrs = ref("");
const selectedCrs = ref<CRSList | undefined>(undefined);
const assigning = ref(false);
const loadingCurrentCrs = ref(false);
const { convertCrs, changeProjectCrs, followProject } = useCrs();
const UIStore = useUIStore();
const isGeographic = ref(false);
const crsKnown = ref(false);
const mode = ref<"assign" | "convert" | "align">("assign");
const converting = ref(false);
// "All data": the data in the same CRS state for assign, the whole project for convert
const scope = ref<"all" | "one">("one");
// Relabeling a georeferenced data whose coordinates do not fit is usually a missed convert
const assignMismatch = ref<string | undefined>(undefined);
const linkCandidates = useCrsLinkCandidates(() => item.value);

// A wrong CRS is the error of one data; a CRS change usually moves the whole project
watch(mode, (value) => {
  scope.value = value === "assign" ? "one" : "all";
  assignMismatch.value = undefined;
});

async function fetchCurrentCrs(): Promise<void> {
  currentCrs.value = "";
  selectedCrs.value = undefined;
  scope.value = "one";
  assignMismatch.value = undefined;
  mode.value = "assign";
  isGeographic.value = false;
  crsKnown.value = false;
  if (itemId === undefined) {
    return;
  }
  const id = itemId;
  loadingCurrentCrs.value = true;
  try {
    await backStore.request(
      {
        schema: back_schemas.opengeodeweb_back.crs.active,
        params: { id },
      },
      {
        // Without geographic info, the active CRS is OpenGeode's default local one ("points")
        response_function: async ({ crs_info }) => {
          isGeographic.value = crs_info !== undefined;
          // Changing the CRS of a georeferenced data is reprojecting it
          if (crs_info !== undefined) {
            mode.value = "convert";
          }
          crsKnown.value = true;
          currentCrs.value = crs_info
            ? `${crs_info.authority}:${crs_info.code} — ${crs_info.name}`
            : "None (local coordinates)";
          // The file is the reference: refresh the stored CRS shown in the table and tree,
          // Only when it differs, as each write refreshes every live view of the data
          if (item.value !== undefined && formatCrs(item.value.crs) !== formatCrs(crs_info)) {
            await dataStore.updateItem(id, { crs: crs_info });
          }
        },
      },
    );
  } finally {
    loadingCurrentCrs.value = false;
  }
}

watch(
  () => show && itemId,
  async (value) => {
    if (value) {
      await fetchCurrentCrs();
    }
  },
  { immediate: true },
);

// Picking only works in the viewer: the alignment continues in its drawer
async function openAlignment(target: Pick<CrsItem, "data_id">): Promise<void> {
  // The drawer needs the whole data: a linked data is only known by its CRS fields
  const full = await dataStore.item(target.data_id);
  await navigateTo("/");
  UIStore.openCrsAlign(full);
}

const warnImplausible = useImplausibleWarning(openAlignment);

async function onAssigned(
  assignedItem: Pick<CrsItem, "data_id" | "name">,
  linked: CrsItem[],
  response: AssignResponse,
  { guarded, projectCrs }: { guarded: boolean; projectCrs: CRSList | undefined },
): Promise<void> {
  const entries = buildAssignedEntries(assignedItem, linked, response);
  // A data left out by the check keeps its CRS: nothing to store
  for (const entry of entries.filter((assigned) => assigned.crs !== undefined)) {
    // oxlint-disable-next-line no-await-in-loop
    await dataStore.updateItem(entry.data_id, { crs: entry.crs });
  }
  // The plausible data join the project CRS; the others keep it and get the warning
  await followProject(plausibleEntries(entries), projectCrs);
  if (guarded && response.crs === undefined) {
    // The user chooses between converting and relabeling anyway
    assignMismatch.value = formatCrsCode(selectedCrs.value);
    return;
  }
  emit("assigned");
  emit("update:show", false);
  warnImplausible(
    entries.filter((entry) => entry.implausible === true && entry.crs !== undefined),
    response.crs,
    itemId,
  );
}

// Data already in a CRS are relabeled only when their coordinates fit it, unless confirmed
async function handleAssign(anyway = false): Promise<void> {
  const assignedItem = item.value;
  if (!assignedItem || !selectedCrs.value || assigning.value) {
    return;
  }
  const linked = scope.value === "all" ? linkCandidates.value : [];
  const linkedDataIds = linked.map((linkedItem) => linkedItem.data_id);
  const guarded = isGeographic.value && !anyway;
  // Taken before: the project follows the assigned data as soon as they are stored
  const { projectCrs } = crsStore;
  assignMismatch.value = undefined;
  assigning.value = true;
  try {
    await backStore.request(
      {
        schema: back_schemas.opengeodeweb_back.crs.assign_geographic,
        params: {
          id: assignedItem.data_id,
          ...(linkedDataIds.length > 0 && { linked_ids: linkedDataIds }),
          ...(guarded && { only_plausible: true }),
          ...selectedCrs.value,
        },
      },
      {
        response_function: async (response: AssignResponse) => {
          await onAssigned(assignedItem, linked, response, {
            guarded,
            projectCrs,
          });
        },
      },
    );
  } finally {
    assigning.value = false;
  }
}

function convertInstead(): void {
  mode.value = "convert";
}

async function handleConvert(): Promise<void> {
  if (!item.value || !selectedCrs.value || converting.value) {
    return;
  }
  converting.value = true;
  try {
    if (scope.value === "all") {
      await changeProjectCrs(selectedCrs.value);
    } else {
      await convertCrs(item.value, selectedCrs.value);
    }
    emit("converted");
    emit("update:show", false);
  } finally {
    converting.value = false;
  }
}

async function startAlignment(): Promise<void> {
  if (!item.value) {
    return;
  }
  emit("update:show", false);
  await openAlignment(item.value);
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
          <!-- Re-aligning restarts from the original coordinates -->
          <v-btn v-if="crsKnown" value="align" data-testid="crsModeAlign" class="text-none">
            Georeference
          </v-btn>
        </v-btn-toggle>
      </div>
      <!-- Next to the mode: what gets assigned or converted stays visible without scrolling -->
      <v-radio-group
        v-if="item && mode !== 'align'"
        v-model="scope"
        inline
        hide-details
        density="compact"
        class="mt-4 flex-shrink-0 text-white"
        data-testid="crsScope"
      >
        <v-radio label="All data" value="all" data-testid="crsScope-all" />
        <v-radio label="This data only" value="one" data-testid="crsScope-one" />
      </v-radio-group>
      <p
        v-if="mode !== 'align'"
        class="text-caption text-white opacity-80 mt-2 mb-0"
        data-testid="crsModeHint"
      >
        {{
          mode === "assign"
            ? "The coordinates are already in this CRS: fix a wrong or missing CRS."
            : "Reproject the coordinates to this CRS."
        }}
      </p>
      <v-alert
        v-if="assignMismatch"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-4 flex-shrink-0"
        data-testid="crsAssignMismatch"
      >
        These coordinates do not fit {{ assignMismatch }}. Did you mean Convert?
        <div class="d-flex justify-end ga-2 mt-2">
          <v-btn
            size="small"
            variant="text"
            class="text-none"
            data-testid="crsConvertInstead"
            @click="convertInstead"
          >
            Convert instead
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            class="text-none"
            data-testid="crsAssignAnyway"
            @click="handleAssign(true)"
          >
            Assign anyway
          </v-btn>
        </div>
      </v-alert>

      <v-card-text class="pt-8 px-0">
        <CrsSelector
          v-if="item && mode !== 'align'"
          :key="item.data_id"
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
            Start georeferencing
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
          @click="handleAssign()"
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
