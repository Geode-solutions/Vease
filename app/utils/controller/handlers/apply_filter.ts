// Third party imports
import { attributeArrayName, getAttributeRange } from "@ogw_front/utils/attributes";
import type { SliceAxis } from "@ogw_front/utils/slice";

// Local imports
import { type AttributeKind, getDataItem } from "@vease/utils/controller/targets";
import { checkRange, findAttribute, resolveItem } from "@vease/utils/controller/attributes";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { need } from "@vease/utils/controller/errors";

type FilterName = "shrink" | "explode" | "slice" | "clip" | "threshold";
type ThresholdLocation = AttributeKind | "point";

interface ApplyFilterParams {
  filter: FilterName;
  ids: string[];
  remove?: boolean;
  factor?: number;
  slices?: { axis: SliceAxis; index: number }[];
  planes?: { origin: number[]; normal: number[] }[];
  attribute?: string;
  location?: ThresholdLocation;
  item?: number;
  minimum?: number;
  maximum?: number;
}

type HybridViewerStore = ReturnType<typeof getHybridViewerStore>;

const DEFAULT_SHRINK_FACTOR = 0.8;
const NO_SHRINK_FACTOR = 1;
const DEFAULT_EXPLODE_FACTOR = 0.2;
const NO_EXPLODE_FACTOR = 0;
// A time series is thresholded on its first step, the one the attribute selector starts on
const FIRST_TIME_STEP = 0;
// The viewer speaks of point and cell: cell stands for any element that is not a vertex
const THRESHOLD_LOCATIONS: Record<ThresholdLocation, AttributeKind | AttributeKind[]> = {
  vertex: "vertex",
  point: "vertex",
  edge: "edge",
  cell: ["edge", "cell", "polygon", "polyhedron"],
  polygon: "polygon",
  polyhedron: "polyhedron",
};

type Applied = Record<string, unknown>;
type FilterHandler = (params: ApplyFilterParams, store: HybridViewerStore) => Promise<Applied>;

async function shrink(params: ApplyFilterParams, store: HybridViewerStore): Promise<Applied> {
  const factor =
    params.remove === true ? NO_SHRINK_FACTOR : (params.factor ?? DEFAULT_SHRINK_FACTOR);
  await store.setShrink(params.ids, factor);
  return { factor };
}

async function explode(params: ApplyFilterParams, store: HybridViewerStore): Promise<Applied> {
  const factor =
    params.remove === true ? NO_EXPLODE_FACTOR : (params.factor ?? DEFAULT_EXPLODE_FACTOR);
  await store.setExplode(params.ids, factor);
  return { factor };
}

async function slice(params: ApplyFilterParams, store: HybridViewerStore): Promise<Applied> {
  const slices = params.remove === true ? [] : need(params.filter, "slices", params.slices);
  const maxIndices = await store.setSlice(params.ids, slices);
  return { maxIndices };
}

async function clip(params: ApplyFilterParams, store: HybridViewerStore): Promise<Applied> {
  const planes = params.remove === true ? [] : need(params.filter, "planes", params.planes);
  await store.setClippingPlanes(params.ids, planes);
  return {};
}

async function threshold(params: ApplyFilterParams, store: HybridViewerStore): Promise<Applied> {
  const { ids, minimum, maximum } = params;
  if (params.remove === true) {
    await store.setThreshold(ids);
    return {};
  }
  const name = need(params.filter, "attribute", params.attribute);
  checkRange(minimum, maximum);
  const found = await findAttribute({
    id: ids[0] ?? "",
    name,
    location: params.location === undefined ? undefined : THRESHOLD_LOCATIONS[params.location],
  });
  const item = resolveItem(params.item, found.attribute);
  const range = getAttributeRange(found.attribute, item);
  const isSeries = (found.attribute.time_steps?.length ?? 0) > 0;
  const bounds = { item, minimum: minimum ?? range.min, maximum: maximum ?? range.max };
  await store.setThreshold(ids, {
    name: attributeArrayName(name, isSeries ? FIRST_TIME_STEP : undefined),
    location: found.kind === "vertex" ? "point" : "cell",
    ...bounds,
  });
  return { attribute: name, location: found.kind, ...bounds };
}

const FILTERS: Record<FilterName, FilterHandler> = { shrink, explode, slice, clip, threshold };

async function applyFilter(params: unknown): Promise<Applied> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const request = params as ApplyFilterParams;
  await Promise.all(
    request.ids.map(async (id) => {
      await getDataItem(id);
    }),
  );
  const applied = await FILTERS[request.filter](request, getHybridViewerStore());
  return { filter: request.filter, ids: request.ids, ...applied };
}

export { applyFilter };
