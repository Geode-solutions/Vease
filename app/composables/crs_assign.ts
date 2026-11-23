import { type CrsItem, useDataStore } from "@ogw_front/stores/data";
import type { CRS } from "@geode/opengeodeweb-back/schema_types";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { DataIdentified } from "@ogw_front/types/identifiers";
import { formatCrsCode } from "@ogw_front/utils/crs";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUIStore } from "@vease/stores/ui";

interface AssignedEntry extends DataIdentified {
  name: string;
  crs?: CRS;
  implausible?: boolean;
}

// Unsupported: the data cannot hold a CRS, like a grid, and is left as it is
interface AssignResponse {
  crs?: CRS;
  implausible?: boolean;
  unsupported?: boolean;
  linked?: { id: string; crs?: CRS; implausible?: boolean; unsupported?: boolean }[];
}

function plausibleEntries(entries: AssignedEntry[]): { data_id: DataId; name: string; crs: CRS }[] {
  return entries.flatMap(({ data_id, name, crs, implausible }) => {
    if (crs === undefined || implausible === true) {
      return [];
    }
    return [{ data_id, name, crs }];
  });
}

function buildAssignedEntries(
  assignedItem: Pick<CrsItem, "data_id" | "name">,
  linked: CrsItem[],
  { crs, implausible, linked: linkedResponses }: AssignResponse,
): AssignedEntry[] {
  return [
    { data_id: assignedItem.data_id, name: assignedItem.name, crs, implausible },
    ...linked.map(({ data_id: linkedId, name }) => {
      const response = linkedResponses?.find((entry) => entry.id === linkedId);
      return {
        data_id: linkedId,
        name,
        crs: response?.crs,
        implausible: response?.implausible,
      };
    }),
  ];
}

function implausibleDescription(
  implausibleItems: Pick<CrsItem, "data_id" | "name">[],
  crs: CRS | undefined,
  itemId: string | undefined,
): string {
  const mismatch = `do not match ${formatCrsCode(crs)}. Georeference the data?`;
  // Named when linked data were assigned too: the user must know which one to align
  return implausibleItems.length === 1 && implausibleItems[0]?.data_id === itemId
    ? `These coordinates ${mismatch}`
    : `${implausibleItems.map(({ name }) => name).join(", ")}: these coordinates ${mismatch}`;
}

type ImplausibleWarning = (
  implausibleItems: Pick<CrsItem, "data_id" | "name">[],
  crs: CRS | undefined,
  itemId: string | undefined,
) => void;

// Picking only works in the viewer: the alignment continues in its drawer
function useOpenCrsAlignment(): (target: Pick<CrsItem, "data_id">) => Promise<void> {
  const dataStore = useDataStore();
  const UIStore = useUIStore();
  return async (target) => {
    // The drawer needs the whole data: a linked data is only known by its CRS fields
    const full = await dataStore.item(target.data_id);
    await navigateTo("/");
    // A copy: the Vease item type is open to any field, the stored one is not
    UIStore.openCrsAlign({ ...full });
  };
}

function useImplausibleWarning(
  openAlignment: (target: Pick<CrsItem, "data_id">) => Promise<void>,
): ImplausibleWarning {
  const feedbackStore = useFeedbackStore();

  // The label is kept: local coordinates usually need an alignment instead
  return (implausibleItems, crs, itemId) => {
    const [first] = implausibleItems;
    if (!first) {
      return;
    }
    const description = implausibleDescription(implausibleItems, crs, itemId);
    feedbackStore.add_warning(description, {
      label: "Georeference",
      onClick: () => {
        void openAlignment(first);
      },
    });
  };
}

export type { AssignResponse, AssignedEntry };
export { buildAssignedEntries, plausibleEntries, useImplausibleWarning, useOpenCrsAlignment };
