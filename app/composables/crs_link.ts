import type { ComputedRef } from "vue";
import type { CrsItem } from "@ogw_front/stores/data";
import { sameCrsState } from "@ogw_front/utils/crs";
import { useCrsStore } from "@ogw_front/stores/crs";

// Data offered by "Apply also to": only data in the same CRS state can share the frame or the CRS of the item
function useCrsLinkCandidates(
  item: () => Pick<CrsItem, "id" | "crs"> | undefined,
): ComputedRef<CrsItem[]> {
  const crsStore = useCrsStore();
  return computed(() => {
    const current = item();
    if (!current) {
      return [];
    }
    return crsStore.crsItems.filter(
      (other) => other.id !== current.id && sameCrsState(other.crs, current.crs),
    );
  });
}

export { useCrsLinkCandidates };
