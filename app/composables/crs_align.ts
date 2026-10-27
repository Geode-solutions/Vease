import type { AlignMode, CrsPoint } from "@vease/composables/crs";
import { onKeyStroke } from "@vueuse/core";
import { useViewerStore } from "@ogw_front/stores/viewer";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

interface EditablePoint {
  x: number | string;
  y: number | string;
}

// Rows kept for the affine mode: switching modes never loses typed points
const NB_POINTS = 3;
const POINT_COUNTS: Record<AlignMode, number> = { similarity: 2, affine: 3 };
const preview_schema = viewer_schemas.opengeodeweb_viewer.viewer.preview_points;

function emptyPoints(): EditablePoint[] {
  return Array.from({ length: NB_POINTS }, () => ({ x: "", y: "" }));
}

function notPicked(): boolean[] {
  return Array.from({ length: NB_POINTS }, () => false);
}

function toNumber(value: number | string | undefined): number {
  return Number(String(value).replaceAll(",", "."));
}

// "" or a partly typed "-" / "." is not a coordinate yet
function isCoordinate(value: number | string): boolean {
  return value !== "" && Number.isFinite(toNumber(value));
}

function isFilled(point: EditablePoint): boolean {
  return isCoordinate(point.x) && isCoordinate(point.y);
}

function isEmpty(point: EditablePoint | undefined): boolean {
  return point === undefined || (point.x === "" && point.y === "");
}

// Source points are picked on the data (only x and y are used) or typed, target points are typed
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types, max-lines-per-function, max-statements
function useCrsAlign() {
  const viewerStore = useViewerStore();
  const sourcePoints = ref<EditablePoint[]>(emptyPoints());
  const targetPoints = ref<EditablePoint[]>(emptyPoints());
  const pickingActive = ref(false);
  // Picked z only places the preview markers on the data
  const pickedZ = ref<number[]>([]);
  // Picked points lie on the displayed data, typed ones are original coordinates
  const pickedSources = ref<boolean[]>(notPicked());
  const mode = ref<AlignMode>("similarity");
  const pointCount = computed(() => POINT_COUNTS[mode.value]);
  const visibleSourcePoints = computed(() => sourcePoints.value.slice(0, pointCount.value));
  const visibleTargetPoints = computed(() => targetPoints.value.slice(0, pointCount.value));

  function pairFilled(index: number): boolean {
    const source = sourcePoints.value[index];
    const target = targetPoints.value[index];
    return source !== undefined && target !== undefined && isFilled(source) && isFilled(target);
  }

  function pairEmpty(index: number): boolean {
    return isEmpty(sourcePoints.value[index]) && isEmpty(targetPoints.value[index]);
  }

  // Without distortion the second pair is optional, but a half filled one is never dropped
  const usedPairs = computed(() => {
    if (mode.value === "affine" || pairFilled(1)) {
      return pointCount.value;
    }
    return 1;
  });

  const isComplete = computed(() => {
    if (mode.value === "affine") {
      return [0, 1, 2].every((index) => pairFilled(index));
    }
    return pairFilled(0) && (pairFilled(1) || pairEmpty(1));
  });

  function setMode(newMode: AlignMode): void {
    mode.value = newMode;
  }

  function toSourceCrsPoints(): CrsPoint[] {
    return sourcePoints.value.slice(0, usedPairs.value).map((point, index) => ({
      x: toNumber(point.x),
      y: toNumber(point.y),
      picked: pickedSources.value[index] ?? false,
    }));
  }

  function toTargetCrsPoints(): CrsPoint[] {
    return targetPoints.value
      .slice(0, usedPairs.value)
      .map((point) => ({ x: toNumber(point.x), y: toNumber(point.y) }));
  }

  function editSourcePoint(
    index: number,
    coord: keyof EditablePoint,
    value: number | string,
  ): void {
    const point = sourcePoints.value[index];
    if (!point) {
      return;
    }
    point[coord] = value;
    pickedSources.value[index] = false;
  }

  function togglePickMode(): void {
    pickingActive.value = !pickingActive.value;
    viewerStore.toggle_picking_mode(pickingActive.value);
  }

  async function preview(): Promise<void> {
    const points = visibleSourcePoints.value
      .map((point, index) => ({
        x: toNumber(point.x),
        y: toNumber(point.y),
        z: pickedZ.value[index] ?? 0,
        filled: isFilled(point),
      }))
      .filter(({ filled }) => filled)
      .map(({ x, y, z }) => ({ x, y, z }));
    await viewerStore.request({ schema: preview_schema, params: { points, style: "points" } });
  }

  function reset(): void {
    if (pickingActive.value) {
      viewerStore.toggle_picking_mode(false);
    }
    sourcePoints.value = emptyPoints();
    targetPoints.value = emptyPoints();
    pickedZ.value = [];
    pickedSources.value = notPicked();
    mode.value = "similarity";
  }

  watch(
    () => viewerStore.picked_point,
    (newVal) => {
      if (!pickingActive.value || newVal.x === undefined || newVal.y === undefined) {
        return;
      }
      const firstEmpty = visibleSourcePoints.value.findIndex((point) => !isFilled(point));
      if (firstEmpty === -1) {
        return;
      }
      sourcePoints.value[firstEmpty] = { x: toNumber(newVal.x), y: toNumber(newVal.y) };
      pickedZ.value[firstEmpty] = toNumber(newVal.z);
      pickedSources.value[firstEmpty] = true;
    },
    { deep: true },
  );

  watch([sourcePoints, mode], preview, { deep: true });

  watch(
    () => viewerStore.picking_mode,
    (newVal) => {
      pickingActive.value = newVal;
    },
  );

  onKeyStroke("Escape", (event) => {
    if (pickingActive.value) {
      viewerStore.toggle_picking_mode(false);
      event.stopImmediatePropagation();
    }
  });

  onUnmounted(async () => {
    reset();
    await viewerStore.request({ schema: preview_schema, params: { points: [], style: "points" } });
  });

  return {
    sourcePoints,
    targetPoints,
    pickingActive,
    togglePickMode,
    reset,
    isComplete,
    mode,
    setMode,
    visibleSourcePoints,
    visibleTargetPoints,
    toSourceCrsPoints,
    toTargetCrsPoints,
    editSourcePoint,
  };
}

export { useCrsAlign };
