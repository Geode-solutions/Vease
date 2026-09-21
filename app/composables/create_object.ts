import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow";
import { onKeyStroke } from "@vueuse/core";
import { useUIStore } from "@vease/stores/ui";
import { useViewerStore } from "@ogw_front/stores/viewer";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ApiSchema } from "@vease/utils/external_stores";
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
  onPickedPoint?: (point: Point, points: Point[]) => boolean | void;
  onReset?: () => void;
}

function createEmptyPoint(): Point {
  return { x: "", y: "", z: "" };
}

function formatPoints(pts: Point[]) {
  return pts.map((point) => ({
    x: Number(String(point.x).replaceAll(",", ".")),
    y: Number(String(point.y).replaceAll(",", ".")),
    z: Number(String(point.z).replaceAll(",", ".")),
  }));
}

const preview_schema = viewer_schemas.opengeodeweb_viewer.viewer.preview_points;

// oxlint-disable-next-line max-lines-per-function, max-statements
export function useCreateObjectTool({
  namePrefix,
  minPoints,
  schema,
  getAdditionalPayload = () => ({}),
  previewStyle = undefined,
  previewExtraSources = [],
  getPreviewParams = () => ({}),
  onPickedPoint = undefined,
  onReset = undefined,
}: CreateObjectToolOptions) {
  const UIStore = useUIStore();
  const backStore = getBackStore();
  const hybridViewerStore = getHybridViewerStore();
  const viewerStore = useViewerStore();

  let counter = 0;
  const pickingActive = ref(false);

  function generateName() {
    counter += 1;
    return counter === 1 ? namePrefix : `${namePrefix} ${counter}`;
  }

  const name = ref(generateName());

  const points = ref<Point[]>(Array.from({ length: minPoints }, () => createEmptyPoint()));

  function addPoint() {
    points.value.push(createEmptyPoint());
  }

  function removePoint(index: number) {
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
    if (onReset) {
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

      if (onPickedPoint && onPickedPoint(new_point, points.value)) {
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
      if (event) {
        event.stopImmediatePropagation();
      }
    }
  });

  onUnmounted(async () => {
    if (viewerStore.picking_mode) {
      viewerStore.toggle_picking_mode(false);
    }
    if (previewStyle) {
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

  if (previewStyle) {
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

  function sanitizeInput(value: unknown, index: number, field: keyof Point) {
    const point = points.value[index];
    if (!point) {
      return;
    }
    const val = String(value)
      .replaceAll(",", ".")
      .replaceAll(/[^0-9eE+\-.]/gu, "");
    const parts = val.split(/[eE]/u);
    point[field] = parts.length > 2 ? `${parts[0]}e${parts[1]}` : val;
  }

  function handlePaste(event: ClipboardEvent, index: number, field: keyof Point) {
    const text = event?.clipboardData?.getData("text") || "";
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
      point.z = coords[2] || "0";
    } else {
      point[field] = coords[0] ?? "";
    }
    event.preventDefault();
  }

  async function createObject() {
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
      await importItem({ ...(resp as Record<string, unknown>) });
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
