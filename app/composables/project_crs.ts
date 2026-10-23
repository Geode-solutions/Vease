import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { type FeedbackAction, useFeedbackStore } from "@ogw_front/stores/feedback";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { formatCrsCode } from "@ogw_front/utils/crs";
import { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";

// Shared by every instance: a batch is harmonized once the previous one is done
let queue: Promise<void> = Promise.resolve();

function sameCrs(left: CRSList, right: CRSList): boolean {
  return left.authority === right.authority && left.code === right.code;
}

function byCreation(items: DataItem[]): DataItem[] {
  return items.toSorted((left, right) =>
    (left.created_at ?? "").localeCompare(right.created_at ?? ""),
  );
}

// A failed batch must not block the next ones
async function settled(promise: Promise<void>): Promise<void> {
  try {
    await promise;
  } catch {
    // The failure is reported by the caller of the batch
  }
}

function names(items: DataItem[]): string {
  return items.map((item) => item.name).join(", ");
}

// The project CRS is the first one met: imported data in another CRS is converted to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
function useProjectCrs() {
  const dataStore = useDataStore();
  const crsStore = useCrsStore();
  const feedbackStore = useFeedbackStore();
  const { convertCrs } = useCrs();

  // One dialog can only edit one item: several items are fixed from the data manager
  function editAction(items: DataItem[]): FeedbackAction | undefined {
    const [item] = items;
    if (items.length !== 1 || item === undefined) {
      return undefined;
    }
    return {
      label: "Edit CRS",
      onClick: () => {
        crsStore.requestCrsEdit(item.id);
      },
    };
  }

  async function harmonize(ids: string[]): Promise<void> {
    const items = byCreation(await dataStore.allItems());
    const imported = items.filter((item) => ids.includes(item.id));
    const existing = items.filter((item) => !ids.includes(item.id));
    const reference = (existing.find((item) => item.crs) ?? imported.find((item) => item.crs))
      ?.crs;
    if (reference === undefined) {
      return;
    }
    const converted: DataItem[] = [];
    const failed: DataItem[] = [];
    const withoutCrs: DataItem[] = [];
    // Conversions reload the viewer object: one at a time
    // oxlint-disable no-await-in-loop
    for (const item of imported) {
      if (item.crs === undefined) {
        withoutCrs.push(item);
      } else if (!sameCrs(item.crs, reference)) {
        try {
          await convertCrs(item, reference, { focus: false });
          converted.push(item);
        } catch {
          failed.push(item);
        }
      }
    }
    // oxlint-enable no-await-in-loop
    const code = formatCrsCode(reference);
    if (converted.length > 0) {
      feedbackStore.add_success(`Converted to ${code}: ${names(converted)}`);
    }
    if (failed.length > 0) {
      feedbackStore.add_warning(
        `Could not convert to ${code}: ${names(failed)}`,
        editAction(failed),
      );
    }
    if (withoutCrs.length > 0) {
      feedbackStore.add_warning(
        `No CRS, project is in ${code}: ${names(withoutCrs)}`,
        editAction(withoutCrs),
      );
    }
  }

  async function harmonizeAfter(previous: Promise<void>, ids: string[]): Promise<void> {
    await previous;
    await harmonize(ids);
  }

  async function harmonizeImportedCrs(ids: string[]): Promise<void> {
    const run = harmonizeAfter(queue, ids);
    queue = settled(run);
    await run;
  }

  return { harmonizeImportedCrs };
}

export { useProjectCrs };
