<script setup>
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { importItem } from "@ogw_front/utils/import_workflow";
import { useGeodeStore } from "@ogw_front/stores/geode";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

const UIStore = useUIStore();
const geodeStore = useGeodeStore();
const hybridViewerStore = useHybridViewerStore();
const viewerStore = useViewerStore();

let curveCounter = 0;
const pickingActive = ref(false);

function generateName() {
  curveCounter += 1;
  return curveCounter === 1 ? "New Curve" : `New Curve ${curveCounter}`;
}

const curveName = ref(generateName());
function createEmptyPoint() {
  return { x: "", y: "", z: "" };
}
const points = ref([createEmptyPoint(), createEmptyPoint()]);

function addPoint() {
  points.value.push(createEmptyPoint());
}

function removePoint(index) {
  if (points.value.length > 2) {
    points.value.splice(index, 1);
  }
}

function togglePickMode() {
  pickingActive.value = !pickingActive.value;
  viewerStore.toggle_picking_mode(pickingActive.value);
}

function handleClose() {
  if (pickingActive.value) {
    viewerStore.toggle_picking_mode(false);
  }
  curveCounter = 0;
  curveName.value = generateName();
  points.value = [createEmptyPoint(), createEmptyPoint()];
  UIStore.setShowCreateTools(false);
}

watch(
  () => viewerStore.picked_point,
  (newVal) => {
    if (!pickingActive.value || newVal.x === undefined || newVal.y === undefined) {
      return;
    }
    const new_point = {
      x: Number.parseFloat(String(newVal.x).replaceAll(",", ".")),
      y: Number.parseFloat(String(newVal.y).replaceAll(",", ".")),
      z: Number.parseFloat(String(newVal.z).replaceAll(",", ".")),
    };

    const firstEmpty = points.value.findIndex((point) => point.x === "");
    if (firstEmpty === -1) {
      points.value.push(new_point);
    } else {
      points.value[firstEmpty] = new_point;
    }
  },
  { deep: true },
);

watch(
  () => viewerStore.picking_mode,
  (newVal) => (pickingActive.value = newVal),
);

onKeyStroke("Escape", () => {
  if (pickingActive.value) {
    viewerStore.toggle_picking_mode(false);
  }
});

onUnmounted(() => {
  if (viewerStore.picking_mode) {
    viewerStore.toggle_picking_mode(false);
  }
});

const loading = ref(false);
const validPoints = computed(() =>
  points.value.filter((point) => point.x !== "" && point.y !== "" && point.z !== ""),
);
const hasValidCurve = computed(() => validPoints.value.length >= 2);
const validPointCount = computed(() => validPoints.value.length);

function sanitizeInput(value, index, field) {
  const val = String(value)
    .replaceAll(",", ".")
    .replaceAll(/[^0-9eE+\-.]/g, "");
  const parts = val.split(/[eE]/);
  points.value[index][field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
}

function handlePaste(event, index, field) {
  const text = event?.clipboardData?.getData("text") || "";
  const coords = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  if (!coords) {
    return;
  }
  const point = points.value[index];
  if (coords.length >= 2) {
    [point.x, point.y, point.z] = [coords[0], coords[1], coords[2] || "0"];
    event.preventDefault();
  } else {
    [point[field]] = coords;
    event.preventDefault();
  }
}

async function createCurve() {
  if (validPoints.value.length < 2) {
    return;
  }
  const schema = back_schemas.opengeodeweb_back.create.edged_curve;
  loading.value = true;

  const edges = validPoints.value.slice(0, -1).map((_, i) => [i, i + 1]);

  try {
    const resp = await geodeStore.request(schema, {
      name: curveName.value,
      points: validPoints.value.map((point) => ({
        x: Number.parseFloat(String(point.x).replaceAll(",", ".")),
        y: Number.parseFloat(String(point.y).replaceAll(",", ".")),
        z: Number.parseFloat(String(point.z).replaceAll(",", ".")),
      })),
      edges,
    });
    await importItem({ ...resp });
    await hybridViewerStore.remoteRender();
    handleClose();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column" theme="dark">
    <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-vector-polyline" class="mr-3 text-h4" color="secondary" />
      Create Curve
    </v-card-title>

    <v-card-subtitle class="ma-0 pb-2 text-white opacity-80">
      Pick at least 2 points to create a curve.
    </v-card-subtitle>

    <v-card-text class="pt-2 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="curveName"
        label="Curve Name"
        variant="outlined"
        color="white"
        theme="dark"
        base-color="white"
        bg-color="rgba(255, 255, 255, 0.15)"
        class="mb-4 rounded-lg"
        prepend-inner-icon="mdi-format-title"
      />
      <v-form class="mt-2">
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point-row"
          :class="{ 'mb-4': index < points.length - 1 }"
        >
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="secondary" class="mr-1">mdi-circle-small</v-icon>
            <span class="text-caption text-white opacity-60 font-weight-bold text-uppercase">
              Point {{ index + 1 }}
            </span>
            <v-spacer />
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="white"
              :disabled="points.length <= 2"
              @click="removePoint(index)"
            >
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </div>

          <v-row dense>
            <v-col v-for="f in ['x', 'y', 'z']" :key="f" cols="4">
              <v-text-field
                v-model="point[f]"
                inputmode="decimal"
                variant="outlined"
                color="white"
                density="comfortable"
                :rules="[(v) => !!v || `${f.toUpperCase()} is required`]"
                class="rounded-lg"
                theme="dark"
                base-color="white"
                bg-color="rgba(255, 255, 255, 0.15)"
                @paste="handlePaste($event, index, f)"
                @update:modelValue="(v) => sanitizeInput(v, index, f)"
              >
                <template #label
                  ><span class="text-white">{{ f.toUpperCase() }}</span></template
                >
                <template #prepend-inner
                  ><v-icon color="white">mdi-axis-{{ f }}-arrow</v-icon></template
                >
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider v-if="index < points.length - 1" class="mt-2 opacity-20" />
        </div>
        <v-row dense class="mt-3">
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="white"
              size="small"
              block
              class="text-none rounded-lg"
              prepend-icon="mdi-plus"
              @click="addPoint"
            >
              Add point
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-tooltip
              :text="pickingActive ? 'Exit pick mode (Esc)' : 'Pick points from viewer'"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="secondary"
                  :variant="pickingActive ? 'flat' : 'outlined'"
                  size="small"
                  block
                  class="rounded-lg text-none font-weight-bold"
                  :class="{ 'pick-pulse': pickingActive }"
                  prepend-icon="mdi-crosshairs-gps"
                  @click="togglePickMode"
                >
                  {{ pickingActive ? "Stop picking" : "Pick in viewer" }}
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-0 pb-0 mt-2">
      <v-btn
        variant="text"
        color="white"
        size="large"
        class="text-none rounded-lg"
        @click="handleClose"
      >
        <v-icon start>mdi-close-circle</v-icon>Close
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        :loading="loading"
        :disabled="!hasValidCurve"
        class="text-none rounded-lg font-weight-bold"
        elevation="4"
        @click="createCurve"
      >
        <v-icon start>mdi-send</v-icon>
        Create Curve ({{ validPointCount }} pts)
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.point-row {
  transition: all 0.2s ease;
}
@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-secondary), 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-secondary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-secondary), 0);
  }
}
.pick-pulse {
  animation: pulse-ring 1.5s ease-out infinite;
}
</style>
