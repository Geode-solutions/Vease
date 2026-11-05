import { onKeyStroke, watchDebounced } from "@vueuse/core";
import type { CrsPoint } from "@vease/composables/crs";
import { useViewerStore } from "@ogw_front/stores/viewer";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

interface EditablePoint {
  x: number | string;
  y: number | string;
}

// Three pairs: the affine alignment places, rotates, scales and shears the data
const NB_POINTS = 3;
// One preview request once the typing pauses, not one per keystroke
const PREVIEW_DEBOUNCE_MILLISECONDS = 200;
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

interface UseCrsAlignReturn {
  sourcePoints: Ref<EditablePoint[]>;
  targetPoints: Ref<EditablePoint[]>;
  pickingActive: Ref<boolean>;
  togglePickMode: () => void;
  reset: () => void;
  isComplete: ComputedRef<boolean>;
  toSourceCrsPoints: () => CrsPoint[];
  toTargetCrsPoints: () => CrsPoint[];
  editSourcePoint: (index: number, coord: keyof EditablePoint, value: number | string) => void;
}

// Source points are picked on the data (only x and y are used) or typed, target points are typed
// oxlint-disable-next-line max-lines-per-function
function useCrsAlign(): UseCrsAlignReturn {
  const viewerStore = useViewerStore();
  const sourcePoints = ref<EditablePoint[]>(emptyPoints());
  const targetPoints = ref<EditablePoint[]>(emptyPoints());
  const pickingActive = ref(false);
  // Picked z only places the preview markers on the data
  const pickedZ = ref<number[]>([]);
  // Picked points lie on the displayed data, typed ones are original coordinates
  const pickedSources = ref<boolean[]>(notPicked());

  function pairFilled(index: number): boolean {
    const source = sourcePoints.value[index];
    const target = targetPoints.value[index];
    return source !== undefined && target !== undefined && isFilled(source) && isFilled(target);
  }

  const isComplete = computed(() => sourcePoints.value.every((_point, index) => pairFilled(index)));

  function toSourceCrsPoints(): CrsPoint[] {
    return sourcePoints.value.map((point, index) => ({
      x: toNumber(point.x),
      y: toNumber(point.y),
      picked: pickedSources.value[index] ?? false,
    }));
  }

  function toTargetCrsPoints(): CrsPoint[] {
    return targetPoints.value.map((point) => ({ x: toNumber(point.x), y: toNumber(point.y) }));
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
    const points = sourcePoints.value
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
  }

  watch(
    () => viewerStore.picked_point,
    (newVal) => {
      if (!pickingActive.value || newVal.x === undefined || newVal.y === undefined) {
        return;
      }
      const firstEmpty = sourcePoints.value.findIndex((point) => !isFilled(point));
      if (firstEmpty === -1) {
        return;
      }
      sourcePoints.value[firstEmpty] = { x: toNumber(newVal.x), y: toNumber(newVal.y) };
      pickedZ.value[firstEmpty] = toNumber(newVal.z);
      pickedSources.value[firstEmpty] = true;
    },
    { deep: true },
  );

  watchDebounced(sourcePoints, preview, { deep: true, debounce: PREVIEW_DEBOUNCE_MILLISECONDS });

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
    toSourceCrsPoints,
    toTargetCrsPoints,
    editSourcePoint,
  };
}

export { useCrsAlign };
