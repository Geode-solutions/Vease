// Third party imports
import type { GeodeObjectTyped, ViewerObjectTyped } from "@ogw_front/types/identifiers";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { DataName } from "@ogw_front/types/data";
import { useDataStore } from "@ogw_front/stores/data";

interface DataSummary extends GeodeObjectTyped, ViewerObjectTyped {
  id: DataId;
  name: DataName;
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
