import { computed, onUnmounted, ref, watch } from "vue";
import { importItem } from "@ogw_front/utils/import_workflow";
import { onKeyStroke } from "@vueuse/core";
import { useGeodeStore } from "@ogw_front/stores/geode";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";

function createEmptyPoint() {
  return { x: "", y: "", z: "" };
}

// oxlint-disable-next-line max-lines-per-function
export function useCreateObjectTool({
  namePrefix,
  minPoints,
  schema,
  getAdditionalPayload = () => ({}),
}) {
  const UIStore = useUIStore();
  const geodeStore = useGeodeStore();
  const hybridViewerStore = useHybridViewerStore();
  const viewerStore = useViewerStore();

  let counter = 0;
  const pickingActive = ref(false);

  function generateName() {
    counter += 1;
    return counter === 1 ? namePrefix : `${namePrefix} ${counter}`;
  }

  const name = ref(generateName());

  const points = ref(Array.from({ length: minPoints }, () => createEmptyPoint()));

  function addPoint() {
    points.value.push(createEmptyPoint());
  }

  function removePoint(index) {
    if (points.value.length > minPoints) {
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
    counter = 0;
    name.value = generateName();
    points.value = Array.from({ length: minPoints }, () => createEmptyPoint());
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
    (newVal) => {
      pickingActive.value = newVal;
    },
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
  const hasValidPoints = computed(() => validPoints.value.length >= minPoints);
  const validPointCount = computed(() => validPoints.value.length);

  function sanitizeInput(value, index, field) {
    const val = String(value)
      .replaceAll(",", ".")
      .replaceAll(/[^0-9eE+\-.]/gu, "");
    const parts = val.split(/[eE]/u);
    points.value[index][field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
  }

  function handlePaste(event, index, field) {
    const text = event?.clipboardData?.getData("text") || "";
    const coords = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/gu);
    if (!coords) {
      return;
    }
    const point = points.value[index];
    if (coords.length >= 2) {
      [point.x, point.y] = coords;
      point.z = coords[2] || "0";
    } else {
      [point[field]] = coords;
    }
    event.preventDefault();
  }

  async function createObject() {
    if (validPoints.value.length < minPoints) {
      return;
    }
    loading.value = true;
    try {
      const formattedPoints = validPoints.value.map((point) => ({
        x: Number.parseFloat(String(point.x).replaceAll(",", ".")),
        y: Number.parseFloat(String(point.y).replaceAll(",", ".")),
        z: Number.parseFloat(String(point.z).replaceAll(",", ".")),
      }));

      const payload = {
        name: name.value,
        points: formattedPoints,
        ...getAdditionalPayload(validPoints.value),
      };

      const resp = await geodeStore.request(schema, payload);
      await importItem({ ...resp });
      await hybridViewerStore.remoteRender();
      handleClose();
    } finally {
      loading.value = false;
    }
  }

  return {
    name,
    points,
    pickingActive,
    loading,
    validPoints,
    hasValidPoints,
    validPointCount,
    addPoint,
    removePoint,
    togglePickMode,
    handleClose,
    sanitizeInput,
    handlePaste,
    createObject,
  };
}
