import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { type FeedbackAction, useFeedbackStore } from "@ogw_front/stores/feedback";
import { formatCrsCode, sameCrs } from "@ogw_front/utils/crs";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { useCrs } from "@vease/composables/crs";
import { useCrsStore } from "@ogw_front/stores/crs";

// Shared by every instance: a batch is harmonized once the previous one is done
let queue: Promise<void> = Promise.resolve();

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

// Imported data in another CRS than the project is converted to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
function useProjectCrs() {
  const dataStore = useDataStore();
  const crsStore = useCrsStore();
  const feedbackStore = useFeedbackStore();
  const { convertCrs, assignPlausible } = useCrs();

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

  async function assignWithoutCrs(items: DataItem[], crs: CRSList): Promise<string[]> {
    try {
      return await assignPlausible(
        items.map(({ id }) => id),
        crs,
      );
    } catch {
      // The request feedback already shows the error: the data stay flagged in the tree
      return [];
    }
  }

  // The project CRS before the import, else the current one; before any, the first one met
  function referenceCrs(
    projectCrs: CRSList | undefined,
    existing: DataItem[],
    imported: DataItem[],
  ): CRSList | undefined {
    return (
      projectCrs ??
      crsStore.projectCrs ??
      (existing.find((item) => item.crs) ?? imported.find((item) => item.crs))?.crs
    );
  }

  async function convertImported(
    imported: DataItem[],
    reference: CRSList,
  ): Promise<{ converted: DataItem[]; failed: DataItem[]; withoutCrs: DataItem[] }> {
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
    return { converted, failed, withoutCrs };
  }

  function reportConversions(converted: DataItem[], failed: DataItem[], code: string): void {
    if (converted.length > 0) {
      feedbackStore.add_success(`Converted to ${code}: ${names(converted)}`);
    }
    if (failed.length > 0) {
      feedbackStore.add_warning(
        `Could not convert to ${code}: ${names(failed)}`,
        editAction(failed),
      );
    }
  }

  // The data whose coordinates do not fit stay without CRS: the tree flags them
  async function assignMissing(
    withoutCrs: DataItem[],
    reference: CRSList,
    code: string,
  ): Promise<void> {
    const assignedIds = await assignWithoutCrs(withoutCrs, reference);
    const assigned = withoutCrs.filter(({ id }) => assignedIds.includes(id));
    if (assigned.length > 0) {
      feedbackStore.add_success(`Assigned ${code}: ${names(assigned)}`);
    }
  }

  async function harmonize(ids: string[], projectCrs: CRSList | undefined): Promise<void> {
    const items = byCreation(await dataStore.allItems());
    const imported = items.filter((item) => ids.includes(item.id));
    const existing = items.filter((item) => !ids.includes(item.id));
    const reference = referenceCrs(projectCrs, existing, imported);
    if (reference === undefined) {
      return;
    }
    const { converted, failed, withoutCrs } = await convertImported(imported, reference);
    const code = formatCrsCode(reference);
    reportConversions(converted, failed, code);
    await assignMissing(withoutCrs, reference, code);
  }

  async function harmonizeAfter(
    previous: Promise<void>,
    ids: string[],
    projectCrs: CRSList | undefined,
  ): Promise<void> {
    await previous;
    await harmonize(ids, projectCrs);
  }

  // ProjectCrs: the project CRS taken before the data landed, as the project follows them
  async function harmonizeImportedCrs(ids: string[], projectCrs?: CRSList): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    const run = harmonizeAfter(queue, ids, projectCrs);
    queue = settled(run);
    await run;
  }

  return { harmonizeImportedCrs };
}

export { useProjectCrs };
