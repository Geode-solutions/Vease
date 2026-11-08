// Third party imports
import type { DataId } from "@ogw_front/types/identifiers";
import { useDataStore } from "@ogw_front/stores/data";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

// Local imports
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";

async function deleteData(dataId: DataId): Promise<void> {
  const dataStore = useDataStore();
  const treeviewStore = useTreeviewStore();
  await dataStore.deregisterObject(dataId);
  await dataStore.deleteItem(dataId);
  getHybridViewerStore().removeItem(dataId);
  treeviewStore.removeItem(dataId);
  treeviewStore.closeView(dataId);
}

async function renameData(dataId: DataId, name: string): Promise<void> {
  await useDataStore().updateItem(dataId, { name });
  useTreeviewStore().renameItem(dataId, name);
}

// Hidden data leaves the tree, so the visibility flag, the style and the tree change together
async function setDataVisibility(dataId: DataId, visible: boolean): Promise<void> {
  const dataStore = useDataStore();
  const item = await dataStore.item(dataId);
  const changed = item.visible !== visible;
  if (changed) {
    await dataStore.updateItem(dataId, { visible });
  }
  await getDataStyleStore().setVisibility(dataId, visible);
  if (!changed) {
    return;
  }
  const treeviewStore = useTreeviewStore();
  if (visible) {
    treeviewStore.addItem(
      item.geode_object_type,
      item.name,
      dataId,
      item.geode_id,
      item.viewer_type,
    );
  } else {
    treeviewStore.removeItem(dataId);
  }
}

export { deleteData, renameData, setDataVisibility };
