// Third party imports
import type { GeodeObjectTyped, ViewerTyped } from "@ogw_front/types/identifiers";
import { useDataStore } from "@ogw_front/stores/data";

interface DataSummary extends GeodeObjectTyped, ViewerTyped {
  id: string;
  name: string;
  visible: boolean;
}

async function listData(): Promise<{ data: DataSummary[] }> {
  const items = await useDataStore().allItems();
  return {
    data: items.map(({ data_id, name, geode_object_type, viewer_type, visible }) => ({
      id: data_id,
      name,
      geode_object_type,
      viewer_type,
      visible,
    })),
  };
}

export { listData };
