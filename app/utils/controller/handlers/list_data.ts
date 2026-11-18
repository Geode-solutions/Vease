// Third party imports
import type { GeodeObjectTyped, ViewerObjectTyped } from "@ogw_front/types/identifiers";
import { useDataStore } from "@ogw_front/stores/data";

interface DataSummary extends GeodeObjectTyped, ViewerObjectTyped {
  id: string;
  name: string;
  visible: boolean;
}

async function listData(): Promise<{ data: DataSummary[] }> {
  const items = await useDataStore().allItems();
  return {
    data: items.map(({ data_id, name, geode_object_type, viewer_object_type, visible }) => ({
      id: data_id,
      name,
      geode_object_type,
      viewer_object_type,
      visible,
    })),
  };
}

export { listData };
