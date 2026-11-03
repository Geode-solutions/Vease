// Local imports
import { getDataItem } from "@vease/utils/controller/targets";
import { renameData as renameDataItem } from "@vease/utils/data_actions";

interface RenameDataParams {
  id: string;
  name: string;
}

// A rename only changes the tree and the database, the viewer has nothing to render
async function renameData(params: unknown): Promise<RenameDataParams> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const { id, name } = params as RenameDataParams;
  await getDataItem(id);
  await renameDataItem(id, name);
  return { id, name };
}

export { renameData };
