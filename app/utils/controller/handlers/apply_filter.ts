// Third party imports
import { attributeArrayName, getAttributeRange } from "@ogw_front/utils/attributes";
import type { SliceAxis } from "@ogw_front/utils/slice";

// Local imports
import { type AttributeKind, getDataItem } from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";
import { findAttribute } from "@vease/utils/controller/attributes";
import { getHybridViewerStore } from "@vease/utils/external_stores";

type FilterName = "shrink" | "explode" | "slice" | "clip" | "threshold";

interface ApplyFilterParams {
  filter: FilterName;
  ids: string[];
  remove?: boolean;
  factor?: number;
  slices?: { axis: SliceAxis; index: number }[];
  planes?: { origin: number[]; normal: number[] }[];
  attribute?: string;
  location?: "point" | "cell";
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
const THRESHOLD_LOCATIONS: Record<
  "point" | "cell" | "any",
  AttributeKind | AttributeKind[] | undefined
> = {
  point: "vertex",
  cell: ["edge", "cell", "polygon", "polyhedron"],
  any: undefined,
};

type Applied = Record<string, unknown>;
type FilterHandler = (params: ApplyFilterParams, store: HybridViewerStore) => Promise<Applied>;

function need<Value>(filter: FilterName, field: string, value: Value | undefined): Value {
  if (value === undefined) {
    throw new ControllerError(`${filter} needs ${field}`);
  }
  return value;
}

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
  if ((minimum === undefined) !== (maximum === undefined)) {
    throw new ControllerError("Give both minimum and maximum, or neither for the attribute range");
  }
  const found = await findAttribute({
    id: ids[0] ?? "",
    name,
    location: THRESHOLD_LOCATIONS[params.location ?? "any"],
  });
  const item = params.item ?? 0;
  if (item >= found.attribute.nb_items) {
    throw new ControllerError(
      `item ${item} is out of range for "${name}" (nb_items ${found.attribute.nb_items})`,
    );
  }
  const range = getAttributeRange(found.attribute, item);
  const isSeries = (found.attribute.time_steps?.length ?? 0) > 0;
  const location = found.kind === "vertex" ? "point" : "cell";
  const applied = {
    location,
    item,
    minimum: minimum ?? range.min,
    maximum: maximum ?? range.max,
  } as const;
  await store.setThreshold(ids, {
    name: attributeArrayName(name, isSeries ? FIRST_TIME_STEP : undefined),
    ...applied,
  });
  return { attribute: name, ...applied };
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
