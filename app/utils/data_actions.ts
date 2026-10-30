// Third party imports
import { useDataStore } from "@ogw_front/stores/data";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

// Local imports
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";

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

// Hidden data leaves the tree, so the visibility flag, the style and the tree change together
async function setDataVisibility(id: string, visible: boolean): Promise<void> {
  const dataStore = useDataStore();
  const item = await dataStore.item(id);
  const changed = item.visible !== visible;
  if (changed) {
    await dataStore.updateItem(id, { visible });
  }
  await getDataStyleStore().setVisibility(id, visible);
  if (!changed) {
    return;
  }
  const treeviewStore = useTreeviewStore();
  if (visible) {
    treeviewStore.addItem(item.geode_object_type, item.name, id, item.geode_id, item.viewer_type);
  } else {
    treeviewStore.removeItem(id);
  }
}

export { deleteData, renameData, setDataVisibility };
