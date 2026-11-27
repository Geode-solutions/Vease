import type { ActivityEntry } from "@ogw_front/stores/activity";
import type { Pixels } from "@ogw_front/types/ui";

// Below this scroll offset the list is "at the top" and follows the new entries
const TOP_THRESHOLD_PX = 8;

interface ScrollAnchor {
  entryId: string;
  offset: Pixels;
}

interface ActivityFollow {
  atTop: Ref<boolean>;
  newCount: ComputedRef<number>;
  onScroll: () => void;
  backToTop: () => void;
}

// The first row still visible, and how far it is from the top of the view
function findAnchor(list: HTMLElement): ScrollAnchor | undefined {
  for (const row of list.querySelectorAll<HTMLElement>("[data-entry-id]")) {
    if (row.offsetTop + row.offsetHeight > list.scrollTop) {
      return { entryId: row.dataset.entryId ?? "", offset: row.offsetTop - list.scrollTop };
    }
  }
  return undefined;
}

function restoreAnchor(list: HTMLElement, anchor: ScrollAnchor): void {
  const row = list.querySelector<HTMLElement>(`[data-entry-id="${anchor.entryId}"]`);
  if (row !== null) {
    list.scrollTop = row.offsetTop - anchor.offset;
  }
}

// Around each change of the rows: follow it at the top, else keep the first visible row where it was
function keepRowsInPlace(
  list: Readonly<Ref<HTMLElement | null>>,
  rows: () => readonly ActivityEntry[],
  isAtTop: () => boolean,
  follow: () => void,
): void {
  let anchor: ScrollAnchor | undefined = undefined;
  watch(
    rows,
    () => {
      anchor = undefined;
      if (!isAtTop() && list.value !== null) {
        anchor = findAnchor(list.value);
      }
    },
    { flush: "pre" },
  );
  watch(
    rows,
    () => {
      if (isAtTop()) {
        follow();
      } else if (anchor !== undefined && list.value !== null) {
        restoreAnchor(list.value, anchor);
      }
    },
    { flush: "post" },
  );
}

/*
 * Live list, newest first. At the top it follows the new entries; once scrolled down it keeps the rows
 * being read in place (anchored on the first visible row, so the oldest rows dropped at the bottom don't
 * move it) and counts the entries that arrived since, for the "back to top" button.
 */
function useActivityFollow(
  list: Readonly<Ref<HTMLElement | null>>,
  rows: () => readonly ActivityEntry[],
): ActivityFollow {
  const atTop = ref(true);
  const seenUpToId = ref(0);

  const lastId = computed(() => Math.max(0, ...rows().map((entry) => entry.id)));
  const newCount = computed(() => {
    if (atTop.value) {
      return 0;
    }
    return rows().filter((entry) => entry.id > seenUpToId.value).length;
  });

  function markSeen(): void {
    seenUpToId.value = lastId.value;
  }

  function onScroll(): void {
    atTop.value = (list.value?.scrollTop ?? 0) <= TOP_THRESHOLD_PX;
    if (atTop.value) {
      markSeen();
    }
  }

  function backToTop(): void {
    // A direct jump: during a smooth scroll the scroll events would show the button again
    list.value?.scrollTo({ top: 0 });
    atTop.value = true;
    markSeen();
  }

  keepRowsInPlace(list, rows, () => atTop.value, markSeen);
  markSeen();

  return { atTop, newCount, onScroll, backToTop };
}

export { TOP_THRESHOLD_PX, useActivityFollow };
