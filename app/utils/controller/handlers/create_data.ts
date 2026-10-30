// Third party imports
import type { NewDataItem } from "@ogw_front/stores/data";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { importItem } from "@ogw_front/utils/import_workflow";

// Local imports
import { curveEdges, singlePolygon } from "@vease/utils/create_geometry";
import { ControllerError } from "@vease/utils/controller/errors";
import { getBackStore } from "@vease/utils/external_stores";

type DataKind = "point" | "curve" | "surface";
type Coordinates = [number, number, number];

interface CreateDataParams {
  kind: DataKind;
  name: string;
  points: Coordinates[];
  closed?: boolean;
}

const createSchemas = back_schemas.opengeodeweb_back.create;

const SCHEMAS = {
  point: createSchemas.point_set,
  curve: createSchemas.edged_curve,
  surface: createSchemas.polygonal_surface,
};

const MIN_POINTS: Record<DataKind, number> = { point: 1, curve: 2, surface: 3 };

function additionalParams(
  kind: DataKind,
  count: number,
  closed: boolean,
): Record<string, number[][]> {
  if (kind === "curve") {
    return { edges: curveEdges(count, closed) };
  }
  if (kind === "surface") {
    return { polygons: singlePolygon(count) };
  }
  return {};
}

// Renders nothing: manage-data renders once it is done
async function createData({
  kind,
  name,
  points,
  closed = false,
}: CreateDataParams): Promise<{ id: string; name: string }> {
  if (points.length < MIN_POINTS[kind]) {
    throw new ControllerError(`A ${kind} needs at least ${MIN_POINTS[kind]} points`);
  }
  const item = await getBackStore().request({
    schema: SCHEMAS[kind],
    params: {
      name,
      points: points.map(([x, y, z]) => ({ x, y, z })),
      ...additionalParams(kind, points.length, closed),
    },
  });
  // oxlint-disable-next-line no-unsafe-type-assertion -- trusted API boundary; response shape matches NewDataItem.
  const created = item as NewDataItem;
  await importItem(created);
  return { id: created.id, name: created.name ?? name };
}

export { type CreateDataParams, type DataKind, createData };
