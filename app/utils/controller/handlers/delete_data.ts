// Local imports
import { type FailedData, forEachData, withFailed } from "@vease/utils/controller/for_each_data";
import { deleteData as deleteDataItem } from "@vease/utils/data_actions";
import { getDataItem } from "@vease/utils/controller/targets";
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface DeleteDataParams {
  ids: string[];
}

async function deleteData(params: unknown): Promise<{ ids: string[]; failed?: FailedData[] }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const { ids } = params as DeleteDataParams;
  const { ids: deleted, failed } = await forEachData(ids, async (dataId) => {
    await getDataItem(dataId);
    await deleteDataItem(dataId);
  });
  await getHybridViewerStore().remoteRender();
  return withFailed({ ids: deleted }, failed);
}

export { deleteData };
