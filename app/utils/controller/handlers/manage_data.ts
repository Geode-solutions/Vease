// Local imports
import {
  type CreateDataParams,
  type DataKind,
  createData,
} from "@vease/utils/controller/handlers/create_data";
import { type FailedData, forEachData, withFailed } from "@vease/utils/controller/for_each_data";
import { deleteData, renameData } from "@vease/utils/data_actions";
import { ControllerError } from "@vease/utils/controller/errors";
import { getDataItem } from "@vease/utils/controller/targets";
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface ManageDataParams {
  action: "create" | "rename" | "delete";
  ids?: string[];
  name?: string;
  kind?: DataKind;
  points?: CreateDataParams["points"];
  closed?: boolean;
}

interface ManageDataResult {
  action: string;
  ids: string[];
  name?: string;
  failed?: FailedData[];
}

const CREATE_ONLY_OPTIONS = ["kind", "points", "closed"] as const;

function rejectOptions(
  params: ManageDataParams,
  options: readonly (keyof ManageDataParams)[],
): void {
  const given = options.filter((option) => params[option] !== undefined);
  if (given.length > 0) {
    throw new ControllerError(`${given.join(", ")} cannot be given to ${params.action}`);
  }
}

async function create(params: ManageDataParams): Promise<ManageDataResult> {
  rejectOptions(params, ["ids"]);
  const { kind, name, points, closed } = params;
  if (kind === undefined || name === undefined || points === undefined) {
    throw new ControllerError("create needs kind, name and points");
  }
  const created = await createData({ kind, name, points, closed });
  return { action: "create", ids: [created.id], name: created.name };
}

async function rename(params: ManageDataParams): Promise<ManageDataResult> {
  rejectOptions(params, CREATE_ONLY_OPTIONS);
  const { ids = [], name } = params;
  const [id] = ids;
  if (id === undefined || ids.length > 1) {
    throw new ControllerError("rename needs exactly one id");
  }
  if (name === undefined || name === "") {
    throw new ControllerError("rename needs a name");
  }
  await getDataItem(id);
  await renameData(id, name);
  return { action: "rename", ids, name };
}

async function remove(params: ManageDataParams): Promise<ManageDataResult> {
  rejectOptions(params, [...CREATE_ONLY_OPTIONS, "name"]);
  const { ids = [] } = params;
  if (ids.length === 0) {
    throw new ControllerError("delete needs ids");
  }
  const { ids: deleted, failed } = await forEachData(ids, async (id) => {
    await getDataItem(id);
    await deleteData(id);
  });
  return withFailed({ action: "delete", ids: deleted }, failed);
}

const ACTIONS = { create, rename, delete: remove };

async function manageData(params: unknown): Promise<ManageDataResult> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const request = params as ManageDataParams;
  const result = await ACTIONS[request.action](request);
  if (request.action !== "rename") {
    await getHybridViewerStore().remoteRender();
  }
  return result;
}

export { manageData };
