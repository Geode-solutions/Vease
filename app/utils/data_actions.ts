// Third party imports
import { useDataStore } from "@ogw_front/stores/data";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

// Local imports
import { getHybridViewerStore } from "@vease/utils/external_stores";

async function deleteData(id: string): Promise<void> {
  const dataStore = useDataStore();
  const treeviewStore = useTreeviewStore();
  await dataStore.deregisterObject(id);
  await dataStore.deleteItem(id);
  getHybridViewerStore().removeItem(id);
  treeviewStore.removeItem(id);
  treeviewStore.closeView(id);
}

async function renameData(id: string, name: string): Promise<void> {
  await useDataStore().updateItem(id, { name });
  useTreeviewStore().renameItem(id, name);
}

export { deleteData, renameData };
