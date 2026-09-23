// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { afterActionWait } from "./constants";

function noopCleanup(): unknown {
  return undefined;
}

const MUTATION_QUIET_MS = 100;
const MUTATION_POLL_INTERVAL_MS = 20;

async function waitForActionSettled(window: Page, ceilingMs = afterActionWait): Promise<void> {
  await window.evaluate((quietMs: number) => {
    const win = window as unknown as {
      lastMutationAt?: number;
      mutationObserver?: MutationObserver;
    };
    win.lastMutationAt = performance.now();
    if (!win.mutationObserver) {
      const observer = new MutationObserver(() => {
        win.lastMutationAt = performance.now();
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      win.mutationObserver = observer;
    }
    void quietMs;
  }, MUTATION_QUIET_MS);

  await window
    .waitForFunction(
      (quietMs: number) => {
        const win = window as unknown as { lastMutationAt?: number };
        return performance.now() - (win.lastMutationAt ?? 0) >= quietMs;
      },
      MUTATION_QUIET_MS,
      { polling: MUTATION_POLL_INTERVAL_MS, timeout: ceilingMs },
    )
    .catch(noopCleanup);
}

export { waitForActionSettled };
