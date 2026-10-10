// Local imports
import { deleteData, renameData } from "@vease/utils/data_actions";
import { ControllerError } from "@vease/utils/controller/errors";
import { getDataItem } from "@vease/utils/controller/targets";
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface ManageDataParams {
  action: "rename" | "delete";
  id: string;
  name?: string;
}

async function manageData(params: unknown): Promise<{ id: string; action: string }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const { action, id, name } = params as ManageDataParams;
  await getDataItem(id);
  if (action === "rename") {
    if (name === undefined || name === "") {
      throw new ControllerError("rename needs a name");
    }
    await renameData(id, name);
  } else {
    await deleteData(id);
    await getHybridViewerStore().remoteRender();
  }
  return { id, action };
}

export { manageData };
