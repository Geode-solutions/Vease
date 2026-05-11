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

let pointCounter = 0;
const pickingActive = ref(false);

function generateName() {
  pointCounter += 1;
  return pointCounter === 1 ? "New Point" : `New Point ${pointCounter}`;
}

function createEmptyPoint() {
  return { name: generateName(), x: "", y: "", z: "" };
}
const points = ref([createEmptyPoint()]);

function addPoint() {
  points.value.push(createEmptyPoint());
}

function removePoint(index) {
  if (points.value.length > 1) {
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
  pointCounter = 0;
  points.value = [createEmptyPoint()];
  UIStore.setShowCreateTools(false);
}

watch(
  () => viewerStore.picked_point,
  async (newVal) => {
    if (!pickingActive.value || newVal.x === undefined || newVal.y === undefined) {
      return;
    }
    const name = generateName();
    const pointSchema = back_schemas.opengeodeweb_back.create.point;

    await geodeStore
      .request(
        pointSchema,
        {
          name,
          x: Number.parseFloat(String(newVal.x).replaceAll(",", ".")),
          y: Number.parseFloat(String(newVal.y).replaceAll(",", ".")),
          z: Number.parseFloat(String(newVal.z).replaceAll(",", ".")),
        },
        { response_function: (resp) => importItem({ ...resp }) },
      )
      .then(() => hybridViewerStore.remoteRender())
      .catch(() => undefined);
  },
  { deep: true },
);

watch(
  () => viewerStore.picking_mode,
  (newVal) => {
    if (!newVal && pickingActive.value) {
      handleClose();
    }
    pickingActive.value = newVal;
  },
);

function handleEscape(event) {
  if (event.key === "Escape" && pickingActive.value) {
    viewerStore.toggle_picking_mode(false);
  }
}

onMounted(() => globalThis.addEventListener("keydown", handleEscape));
onUnmounted(() => {
  globalThis.removeEventListener("keydown", handleEscape);
  if (viewerStore.picking_mode) {
    viewerStore.toggle_picking_mode(false);
  }
});

const loading = ref(false);
const validPoints = computed(() =>
  points.value.filter(
    (point) => point.name !== "" && point.x !== "" && point.y !== "" && point.z !== "",
  ),
);
const hasValidPoint = computed(() => validPoints.value.length > 0);
const validPointCount = computed(() => validPoints.value.length);

function sanitizeInput(value, index, field) {
  if (field === "name") {
    points.value[index].name = value;
  } else {
    const val = String(value)
      .replaceAll(",", ".")
      .replaceAll(/[^0-9eE+\-.]/g, "");
    const parts = val.split(/[eE]/);
    points.value[index][field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
  }
}

function handlePaste(event, index, field) {
  const text = event?.clipboardData?.getData("text") || "";
  const coords = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  if (!coords) {
    return;
  }
  const point = points.value[index];
  if (coords.length >= 2) {
    [point.x, point.y] = coords;
    point.z = coords[2] || "0";
    event.preventDefault();
  } else {
    [point[field]] = coords;
    event.preventDefault();
  }
}

async function createAllPoints() {
  if (validPoints.value.length === 0) {
    return;
  }
  const schema = back_schemas.opengeodeweb_back.create.point;
  loading.value = true;
  try {
    const promises = validPoints.value.map((point) =>
      geodeStore.request(
        schema,
        {
          name: point.name,
          x: Number.parseFloat(String(point.x).replaceAll(",", ".")),
          y: Number.parseFloat(String(point.y).replaceAll(",", ".")),
          z: Number.parseFloat(String(point.z).replaceAll(",", ".")),
        },
        { response_function: (resp) => importItem({ ...resp }) },
      ),
    );
    await Promise.all(promises);
    hybridViewerStore.remoteRender();
    handleClose();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-card flat color="transparent" class="pa-0" theme="dark">
    <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-circle-medium" class="mr-3 text-h4" color="secondary" />
      Create Point{{ points.length > 1 ? "s" : "" }}
      <v-spacer />
      <v-tooltip
        :text="pickingActive ? 'Exit pick mode (Esc)' : 'Pick points from viewer'"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :color="pickingActive ? 'secondary' : 'white'"
            :variant="pickingActive ? 'flat' : 'outlined'"
            size="small"
            icon
            class="ml-2"
            :class="{ 'pick-pulse': pickingActive }"
            @click="togglePickMode"
          >
            <v-icon>mdi-eyedropper-variant</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-title>

    <v-card-subtitle class="ma-0 pb-2 text-white opacity-80">
      Enter coordinates, use + to add rows, or enable pick mode.
    </v-card-subtitle>

    <v-card-text class="pt-2">
      <v-form class="mt-2">
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point-row"
          :class="{ 'mb-4': index < points.length - 1 }"
        >
          <div class="d-flex align-center mb-2">
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
              :disabled="points.length === 1"
              @click="removePoint(index)"
            >
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </div>

          <v-text-field
            v-model="point.name"
            variant="outlined"
            color="white"
            :rules="[(v) => !!v || 'Name is required']"
            theme="dark"
            base-color="white"
            bg-color="rgba(255, 255, 255, 0.15)"
            class="mb-2 rounded-lg"
            @update:modelValue="(v) => sanitizeInput(v, index, 'name')"
          >
            <template #label><span class="text-white">Object Name</span></template>
            <template #prepend-inner><v-icon color="white">mdi-format-title</v-icon></template>
          </v-text-field>

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
        <v-btn
          variant="outlined"
          color="white"
          size="small"
          block
          class="text-none rounded-lg mt-3"
          prepend-icon="mdi-plus"
          @click="addPoint"
        >
          Add another point
        </v-btn>
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
        :disabled="!hasValidPoint"
        class="text-none rounded-lg font-weight-bold"
        elevation="4"
        @click="createAllPoints"
      >
        <v-icon start>mdi-send</v-icon>
        Create {{ validPointCount > 1 ? `${validPointCount} Points` : "Point" }}
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
