<script setup lang="ts">
// oxlint-disable max-dependencies
import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { formatCrs, formatCrsCode } from "@ogw_front/utils/crs";
import CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { useBackStore } from "@ogw_front/stores/back";
import { useCrs } from "@vease/composables/crs";
import { useCrsLinkCandidates } from "@vease/composables/crs_link";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
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
const dataStore = useDataStore();
const feedbackStore = useFeedbackStore();
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
const linkCandidates = useCrsLinkCandidates(() => item);

// A wrong CRS is the error of one data; a CRS change usually moves the whole project
watch(mode, (value) => {
  scope.value = value === "assign" ? "one" : "all";
});

async function fetchCurrentCrs(): Promise<void> {
  currentCrs.value = "";
  selectedCrs.value = undefined;
  scope.value = "one";
  mode.value = "assign";
  isGeographic.value = false;
  crsKnown.value = false;
  if (!item) {
    return;
  }
  const { id } = item;
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
          crsKnown.value = true;
          currentCrs.value = crs_info
            ? `${crs_info.authority}:${crs_info.code} — ${crs_info.name}`
            : "None (local coordinates)";
          // The file is the reference: refresh the stored CRS shown in the table and tree,
          // Only when it differs, as each write refreshes every live view of the data
          if (formatCrs(item.crs) !== formatCrs(crs_info)) {
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
  () => show,
  async (value) => {
    if (value) {
      await fetchCurrentCrs();
    }
  },
  { immediate: true },
);

// Picking only works in the viewer: the alignment continues in its drawer
async function openAlignment(target: Pick<CrsItem, "id">): Promise<void> {
  // The drawer needs the whole data: a linked data is only known by its CRS fields
  const full = await dataStore.item(target.id);
  await navigateTo("/");
  UIStore.openCrsAlign(full);
}

// The label is kept: local coordinates usually need an alignment instead
function warnImplausible(
  implausibleItems: Pick<CrsItem, "id" | "name">[],
  crs: CRSList | undefined,
): void {
  const [first] = implausibleItems;
  if (!first) {
    return;
  }
  const mismatch = `do not match ${formatCrsCode(crs)}. Georeference the data?`;
  // Named when linked data were assigned too: the user must know which one to align
  const description =
    implausibleItems.length === 1 && first.id === item?.id
      ? `These coordinates ${mismatch}`
      : `${implausibleItems.map(({ name }) => name).join(", ")}: these coordinates ${mismatch}`;
  feedbackStore.add_warning(description, {
    label: "Georeference",
    onClick: () => {
      void openAlignment(first);
    },
  });
}

interface AssignedEntry {
  id: string;
  name: string;
  crs?: CRSList;
  implausible?: boolean;
}

function plausibleEntries(entries: AssignedEntry[]): { id: string; name: string; crs: CRSList }[] {
  return entries.flatMap(({ id, name, crs, implausible }) =>
    crs === undefined || implausible === true ? [] : [{ id, name, crs }],
  );
}

async function handleAssign(): Promise<void> {
  if (!item || !selectedCrs.value || assigning.value) {
    return;
  }
  // The warning action may run once the dialog shows another item
  const assignedItem = item;
  const { id } = assignedItem;
  const linked = scope.value === "all" ? linkCandidates.value : [];
  const linkedDataIds = linked.map((linkedItem) => linkedItem.id);
  assigning.value = true;
  try {
    await backStore.request(
      {
        schema: back_schemas.opengeodeweb_back.crs.assign_geographic,
        params: {
          id,
          ...(linkedDataIds.length > 0 ? { linked_ids: linkedDataIds } : {}),
          ...selectedCrs.value,
        },
      },
      {
        response_function: async ({ crs, implausible, linked: linkedResponses }) => {
          await dataStore.updateItem(id, { crs });
          for (const entry of linkedResponses ?? []) {
            // oxlint-disable-next-line no-await-in-loop
            await dataStore.updateItem(entry.id, { crs: entry.crs });
          }
          emit("assigned");
          emit("update:show", false);
          const entries = [
            { id, name: assignedItem.name, crs, implausible },
            ...linked.map(({ id: linkedId, name }) => {
              const response = linkedResponses?.find((entry) => entry.id === linkedId);
              return { id: linkedId, name, crs: response?.crs, implausible: response?.implausible };
            }),
          ];
          // The plausible data join the project CRS; the others keep it and get the warning
          await followProject(plausibleEntries(entries));
          warnImplausible(
            entries.filter((entry) => entry.implausible === true),
            crs,
          );
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
    await (scope.value === "all"
      ? changeProjectCrs(selectedCrs.value)
      : convertCrs(item, selectedCrs.value));
    emit("converted");
    emit("update:show", false);
  } finally {
    converting.value = false;
  }
}

async function startAlignment(): Promise<void> {
  if (!item) {
    return;
  }
  emit("update:show", false);
  await openAlignment(item);
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
