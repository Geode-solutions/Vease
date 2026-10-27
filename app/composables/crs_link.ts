import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import type { ComputedRef } from "vue";

function sameCrs(first: CRSList | undefined, second: CRSList | undefined): boolean {
  return first?.authority === second?.authority && first?.code === second?.code;
}

// Data offered by "Apply also to": only data in the same CRS state can share the frame or the CRS of the item
function useCrsLinkCandidates(
  item: () => Pick<DataItem, "id" | "crs"> | undefined,
): ComputedRef<DataItem[]> {
  const items = useDataStore().refAllItems();
  return computed(() => {
    const current = item();
    if (!current) {
      return [];
    }
    return items.value.filter(
      (other) => other.id !== current.id && sameCrs(other.crs, current.crs),
    );
  });
}

export { useCrsLinkCandidates };
