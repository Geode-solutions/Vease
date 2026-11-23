import {
  type AssignResponse,
  buildAssignedEntries,
  useImplausibleWarning,
  useOpenCrsAlignment,
} from "@vease/composables/crs_assign";
import { type CrsItem, type DataItem, useDataStore } from "@ogw_front/stores/data";
import { type FeedbackAction, useFeedbackStore } from "@ogw_front/stores/feedback";
import type { CRS } from "@geode/opengeodeweb-back/schema_types";
import { formatCrsCode } from "@ogw_front/utils/crs";
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

function names(items: Pick<DataItem, "name">[]): string {
  return items.map((item) => item.name).join(", ");
}

// Imported data in another CRS than the project is converted to it.
// Data without CRS take the project CRS when their coordinates fit it.
// Others are likely in a local frame: the warning leads to their georeferencing
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
function useProjectCrs() {
  const dataStore = useDataStore();
  const crsStore = useCrsStore();
  const feedbackStore = useFeedbackStore();
  const { assignCrs, convertCrs } = useCrs();
  const warnImplausible = useImplausibleWarning(useOpenCrsAlignment());

  // One dialog can only edit one item: several items are fixed from the data manager
  function editAction(items: Pick<DataItem, "data_id">[]): FeedbackAction | undefined {
    const [item] = items;
    if (items.length !== 1 || item === undefined) {
      return undefined;
    }
    return {
      label: "Edit CRS",
      onClick: () => {
        crsStore.requestCrsEdit(item.data_id);
      },
    };
  }

  // The project CRS before the import, else the current one; before any, the first one met
  function referenceCrs(
    projectCrs: CRS | undefined,
    existing: DataItem[],
    imported: DataItem[],
  ): CRS | undefined {
    return (
      projectCrs ??
      crsStore.projectCrs ??
      (existing.find((item) => item.crs) ?? imported.find((item) => item.crs))?.crs
    );
  }

  async function convertImported(
    imported: DataItem[],
    reference: CRS,
  ): Promise<{ converted: DataItem[]; failed: DataItem[]; withoutCrs: DataItem[] }> {
    const converted: DataItem[] = [];
    const failed: DataItem[] = [];
    const withoutCrs: DataItem[] = [];
    // Conversions reload the viewer object: one at a time
    // oxlint-disable no-await-in-loop
    for (const item of imported) {
      if (item.crs === undefined) {
        withoutCrs.push(item);
      } else if (!crsStore.sameProjectCrs(item.crs, reference)) {
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

  function warnWithoutCrs(withoutCrs: CrsItem[], code: string): void {
    if (withoutCrs.length > 0) {
      feedbackStore.add_warning(
        `No CRS, project in ${code}: ${names(withoutCrs)}`,
        editAction(withoutCrs),
      );
    }
  }

  // The request feedback already shows the error: the caller falls back to the warning
  async function requestAssign(
    first: CrsItem,
    linkedItems: CrsItem[],
    reference: CRS,
  ): Promise<AssignResponse | undefined> {
    try {
      return await assignCrs(first, reference, { linkedItems, onlyPlausible: true });
    } catch {
      return undefined;
    }
  }

  // One request for all of them: data that cannot hold a CRS, like grids, are left out by the back
  async function assignProjectCrs(withoutCrs: CrsItem[], reference: CRS): Promise<void> {
    const [first, ...linkedItems] = withoutCrs;
    if (first === undefined) {
      return;
    }
    const code = formatCrsCode(reference);
    const response = await requestAssign(first, linkedItems, reference);
    if (response === undefined) {
      warnWithoutCrs(withoutCrs, code);
      return;
    }
    const entries = buildAssignedEntries(first, linkedItems, response);
    const assigned = entries.filter((entry) => entry.crs !== undefined);
    if (assigned.length > 0) {
      feedbackStore.add_success(`${code} assigned: ${names(assigned)}`);
    }
    warnImplausible(
      entries.filter((entry) => entry.implausible === true && entry.crs === undefined),
      reference,
      undefined,
    );
  }

  async function harmonize(ids: string[], projectCrs: CRS | undefined): Promise<void> {
    const items = byCreation(await dataStore.allItems());
    const imported = items.filter((item) => ids.includes(item.data_id));
    const existing = items.filter((item) => !ids.includes(item.data_id));
    const reference = referenceCrs(projectCrs, existing, imported);
    if (reference === undefined) {
      return;
    }
    const { converted, failed, withoutCrs } = await convertImported(imported, reference);
    const code = formatCrsCode(reference);
    reportConversions(converted, failed, code);
    await assignProjectCrs(withoutCrs, reference);
  }

  async function harmonizeAfter(
    previous: Promise<void>,
    ids: string[],
    projectCrs: CRS | undefined,
  ): Promise<void> {
    await previous;
    await harmonize(ids, projectCrs);
  }

  // ProjectCrs: the project CRS taken before the data landed, as the project follows them
  async function harmonizeImportedCrs(ids: string[], projectCrs?: CRS): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    const run = harmonizeAfter(queue, ids, projectCrs);
    queue = settled(run);
    await run;
  }

  // A project CRS chosen after the import: the data without CRS take it too, when they fit it
  async function adoptProjectCrs(crs: CRS): Promise<void> {
    await assignProjectCrs(
      crsStore.crsItems.filter((item) => item.crs === undefined),
      crs,
    );
  }

  return { harmonizeImportedCrs, adoptProjectCrs };
}

export { useProjectCrs };
