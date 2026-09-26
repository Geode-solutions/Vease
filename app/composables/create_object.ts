import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import { onKeyStroke } from "@vueuse/core";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ApiSchema } from "@vease/utils/external_stores";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { NewDataItem } from "@ogw_front/stores/data";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

interface Point {
  x: number | string;
  y: number | string;
  z: number | string;
}

interface CreateObjectToolOptions {
  namePrefix: string;
  minPoints: number;
  schema: ApiSchema;
  getAdditionalPayload?: (points: Point[]) => Record<string, unknown>;
  previewStyle?: string;
  previewExtraSources?: unknown[];
  getPreviewParams?: () => Record<string, unknown>;
  onPickedPoint?: (point: Point, points: Point[]) => boolean | undefined;
  onReset?: () => void;
}

interface FormattedPoint {
  x: number;
  y: number;
  z: number;
}

function createEmptyPoint(): Point {
  return { x: "", y: "", z: "" };
}

const COORDINATE_FIELDS: (keyof Point)[] = ["x", "y", "z"];

function fillEmptyCoordinatesWithZero(point: Point, filledField: keyof Point): void {
  for (const coordinate of COORDINATE_FIELDS) {
    if (coordinate !== filledField && point[coordinate] === "") {
      point[coordinate] = "0";
    }
  }
}

function formatPoints(pts: Point[]): FormattedPoint[] {
  return pts.map((point) => ({
    x: Number(String(point.x).replaceAll(",", ".")),
    y: Number(String(point.y).replaceAll(",", ".")),
    z: Number(String(point.z).replaceAll(",", ".")),
  }));
}

const preview_schema = viewer_schemas.opengeodeweb_viewer.viewer.preview_points;

interface UseCreateObjectToolReturn {
  name: Ref<string>;
  points: Ref<Point[]>;
  pickingActive: Ref<boolean>;
  loading: Ref<boolean>;
  validPoints: ComputedRef<Point[]>;
  hasValidPoints: ComputedRef<boolean>;
  validPointCount: ComputedRef<number>;
  addPoint: () => void;
  removePoint: (index: number) => void;
  togglePickMode: () => void;
  handleClose: () => void;
  sanitizeInput: (value: unknown, index: number, field: keyof Point) => void;
  handlePaste: (event: ClipboardEvent, index: number, field: keyof Point) => void;
  createObject: () => Promise<void>;
}

// oxlint-disable-next-line max-lines-per-function, max-statements
export function useCreateObjectTool({
  namePrefix,
  minPoints,
  schema,
  getAdditionalPayload = () => ({}),
  previewStyle,
  previewExtraSources = [],
  getPreviewParams = () => ({}),
  onPickedPoint,
  onReset,
}: CreateObjectToolOptions): UseCreateObjectToolReturn {
  const UIStore = useUIStore();
  const backStore = getBackStore();
  const hybridViewerStore = getHybridViewerStore();
  const viewerStore = useViewerStore();

  let counter = 0;
  const pickingActive = ref(false);

  function generateName(): string {
    counter += 1;
    return counter === 1 ? namePrefix : `${namePrefix} ${counter}`;
  }

  const name = ref(generateName());

  const points = ref<Point[]>(Array.from({ length: minPoints }, () => createEmptyPoint()));

  function addPoint(): void {
    points.value.push(createEmptyPoint());
  }

  function removePoint(index: number): void {
    if (points.value.length > minPoints) {
      points.value.splice(index, 1);
    }
  }

  function togglePickMode(): void {
    pickingActive.value = !pickingActive.value;
    viewerStore.toggle_picking_mode(pickingActive.value);
  }

  function handleClose(): void {
    if (pickingActive.value) {
      viewerStore.toggle_picking_mode(false);
    }
    counter = 0;
    name.value = generateName();
    points.value = Array.from({ length: minPoints }, () => createEmptyPoint());
    if (onReset !== undefined) {
      onReset();
    }
    UIStore.setShowCreateTools(false);
  }

  watch(
    () => viewerStore.picked_point,
    (newVal) => {
      if (!pickingActive.value || newVal.x === undefined || newVal.y === undefined) {
        return;
      }
      const new_point: Point = {
        x: Number(String(newVal.x).replaceAll(",", ".")),
        y: Number(String(newVal.y).replaceAll(",", ".")),
        z: Number(String(newVal.z).replaceAll(",", ".")),
      };

      if (onPickedPoint !== undefined && onPickedPoint(new_point, points.value) === true) {
        return;
      }

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

  onKeyStroke("Escape", (event) => {
    if (pickingActive.value) {
      viewerStore.toggle_picking_mode(false);
      event.stopImmediatePropagation();
    }
  });

  onUnmounted(async () => {
    if (viewerStore.picking_mode) {
      viewerStore.toggle_picking_mode(false);
    }
    if (previewStyle !== undefined) {
      const params = { points: [], style: previewStyle, ...getPreviewParams() };
      await viewerStore.request({ schema: preview_schema, params });
    }
  });

  const loading = ref(false);
  const validPoints = computed(() =>
    points.value.filter((point) => point.x !== "" && point.y !== "" && point.z !== ""),
  );
  const hasValidPoints = computed(() => validPoints.value.length >= minPoints);
  const validPointCount = computed(() => validPoints.value.length);

  if (previewStyle !== undefined) {
    watch(
      [validPoints, ...previewExtraSources],
      async () => {
        const params = {
          points: formatPoints(validPoints.value),
          style: previewStyle,
          ...getPreviewParams(),
        };
        await viewerStore.request({ schema: preview_schema, params });
      },
      { deep: true, immediate: true },
    );
  }

  function sanitizeInput(value: unknown, index: number, field: keyof Point): void {
    const point = points.value[index];
    if (!point) {
      return;
    }
    const val = String(value)
      .replaceAll(",", ".")
      .replaceAll(/[^0-9eE+\-.]/gu, "");
    const parts = val.split(/[eE]/u);
    point[field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
    if (point[field] !== "") {
      fillEmptyCoordinatesWithZero(point, field);
    }
  }

  function handlePaste(event: ClipboardEvent, index: number, field: keyof Point): void {
    const text = event.clipboardData?.getData("text") ?? "";
    const coords = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/gu);
    if (!coords) {
      return;
    }
    const point = points.value[index];
    if (!point) {
      return;
    }
    if (coords.length >= 2) {
      point.x = coords[0] ?? "";
      point.y = coords[1] ?? "";
      point.z = coords[2] ?? "0";
    } else {
      point[field] = coords[0] ?? "";
    }
    event.preventDefault();
  }

  async function createObject(): Promise<void> {
    if (validPoints.value.length < minPoints) {
      return;
    }
    loading.value = true;
    try {
      const params = {
        name: name.value,
        points: formatPoints(validPoints.value),
        ...getAdditionalPayload(validPoints.value),
      };
      const resp = await backStore.request({ schema, params });
      // oxlint-disable-next-line no-unsafe-type-assertion -- trusted API boundary; response shape matches NewDataItem.
      await importItem(resp as NewDataItem);
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
