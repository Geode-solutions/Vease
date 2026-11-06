import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import type { CrsItem } from "@ogw_front/stores/data";
import { formatCrsCode } from "@ogw_front/utils/crs";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

interface AssignedEntry {
  data_id: string;
  name: string;
  crs?: CRSList;
  implausible?: boolean;
}

interface AssignResponse {
  crs?: CRSList;
  implausible?: boolean;
  linked?: { id: string; crs?: CRSList; implausible?: boolean }[];
}

function plausibleEntries(
  entries: AssignedEntry[],
): { data_id: string; name: string; crs: CRSList }[] {
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
  crs: CRSList | undefined,
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
  crs: CRSList | undefined,
  itemId: string | undefined,
) => void;

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
export { buildAssignedEntries, plausibleEntries, useImplausibleWarning };
