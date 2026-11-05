// Third party imports
import { useDataStore } from "@ogw_front/stores/data";

interface DataSummary {
  id: string;
  name: string;
  geode_object_type: string;
  viewer_type: string;
  visible: boolean;
}

async function listData(): Promise<{ data: DataSummary[] }> {
  const items = await useDataStore().allItems();
  return {
    data: items.map(({ id, name, geode_object_type, viewer_type, visible }) => ({
      id,
      name,
      geode_object_type,
      viewer_type,
      visible,
    })),
  };
}

export { listData };
