// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { afterActionWait } from "./constants";

// Browser-side state kept across page.evaluate calls by waitForDomSettled
declare global {
  var e2eLastMutationAt: number | undefined;
  var e2eMutationObserver: MutationObserver | undefined;
}

function noopCleanup(): unknown {
  return undefined;
}

// App/layouts/default.vue renders a fixed top-of-page progress bar (data-testid "microservicesBusyIndicator") whenever infraStore.microservices_busy is true.
// That getter is driven by each microservice's own request counter, so the indicator is the app's own authoritative signal that a backend or viewer RPC is in flight — waiting on it directly is more reliable than inferring activity from console log text.
const BUSY_INDICATOR_TEST_ID = "microservicesBusyIndicator";
const REQUEST_DISPATCH_GRACE_MS = 50;
// Some backend RPCs (attribute-name lookups on a component with many items, for example) occasionally take several seconds under CI load, so the indicator gets generous headroom to clear.
const BUSY_INDICATOR_HARD_CEILING_MS = 10_000;

async function waitForMicroservicesIdle(window: Page, budgetMs: number): Promise<void> {
  await window.waitForTimeout(Math.min(REQUEST_DISPATCH_GRACE_MS, budgetMs));
  await window
    .getByTestId(BUSY_INDICATOR_TEST_ID)
    .waitFor({ state: "hidden", timeout: Math.max(budgetMs, BUSY_INDICATOR_HARD_CEILING_MS) })
    .catch(noopCleanup);
}

const MUTATION_QUIET_MS = 250;
const MUTATION_POLL_INTERVAL_MS = 20;

async function waitForDomSettled(window: Page, budgetMs: number): Promise<void> {
  await window.evaluate((quietMs: number) => {
    globalThis.e2eLastMutationAt = performance.now();
    if (!globalThis.e2eMutationObserver) {
      const observer = new MutationObserver(() => {
        globalThis.e2eLastMutationAt = performance.now();
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      globalThis.e2eMutationObserver = observer;
    }
    void quietMs;
  }, MUTATION_QUIET_MS);

  await window
    .waitForFunction(
      (quietMs: number) => performance.now() - (globalThis.e2eLastMutationAt ?? 0) >= quietMs,
      MUTATION_QUIET_MS,
      { polling: MUTATION_POLL_INTERVAL_MS, timeout: budgetMs },
    )
    .catch(noopCleanup);
}

const MIN_DOM_SETTLE_BUDGET_MS = 250;

// Vtk.js draws camera/colormap results straight to a <canvas>; that paint never touches the DOM, so neither the busy indicator nor the mutation observer can see it.
// Waiting for two real animation frames after everything else has settled ensures the last frame is actually on screen before a screenshot is taken.
async function waitForNextPaint(window: Page): Promise<void> {
  await window
    .evaluate(async () => {
      // oxlint-disable-next-line promise/avoid-new
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });
    })
    .catch(noopCleanup);
}

async function waitForActionSettled(window: Page, ceilingMs = afterActionWait): Promise<void> {
  const startedAt = Date.now();
  await waitForMicroservicesIdle(window, ceilingMs);
  const remainingMs = Math.max(MIN_DOM_SETTLE_BUDGET_MS, ceilingMs - (Date.now() - startedAt));
  await waitForDomSettled(window, remainingMs);
  await waitForNextPaint(window);
}

export { waitForActionSettled };
