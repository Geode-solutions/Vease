// Third party imports
import type { ConsoleMessage, Page } from "@playwright/test";

// Local imports
import { afterActionWait } from "./constants";

function noopCleanup(): unknown {
  return undefined;
}

// App/utils/log.ts logs every microservice RPC as "[id] Request:" / "[id] Request completed:".
// Camera moves and colormap changes go through such an RPC and get drawn to a canvas by vtk.js.
// That canvas draw never touches the DOM, so a DOM-mutation-only settle check can resolve early.
// Tracking these logs instead gives the real RPC completion signal.
const REQUEST_STARTED_MARKER = "Request:";
const REQUEST_COMPLETED_MARKER = "Request completed:";

interface PageActivityState {
  pendingRequests: number;
  lastRequestActivityAt: number;
}

const pageActivityStates = new WeakMap<Page, PageActivityState>();

function trackRequestActivity(window: Page): PageActivityState {
  const existing = pageActivityStates.get(window);
  if (existing) {
    return existing;
  }
  const state: PageActivityState = { pendingRequests: 0, lastRequestActivityAt: Date.now() };
  pageActivityStates.set(window, state);
  window.on("console", (msg: ConsoleMessage) => {
    const text = msg.text();
    if (text.includes(REQUEST_COMPLETED_MARKER)) {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
      state.lastRequestActivityAt = Date.now();
    } else if (text.includes(REQUEST_STARTED_MARKER)) {
      state.pendingRequests += 1;
      state.lastRequestActivityAt = Date.now();
    }
  });
  return state;
}

const REQUEST_DISPATCH_GRACE_MS = 50;
const REQUEST_QUIET_MS = 150;
const REQUEST_POLL_INTERVAL_MS = 20;

async function waitForRequestsSettled(window: Page, budgetMs: number): Promise<void> {
  const state = trackRequestActivity(window);
  const deadline = Date.now() + budgetMs;
  await window.waitForTimeout(Math.min(REQUEST_DISPATCH_GRACE_MS, budgetMs));
  while (Date.now() < deadline) {
    const quietFor = Date.now() - state.lastRequestActivityAt;
    if (state.pendingRequests === 0 && quietFor >= REQUEST_QUIET_MS) {
      return;
    }
    // oxlint-disable-next-line no-await-in-loop
    await window.waitForTimeout(REQUEST_POLL_INTERVAL_MS);
  }
}

const MUTATION_QUIET_MS = 250;
const MUTATION_POLL_INTERVAL_MS = 20;

async function waitForDomSettled(window: Page, budgetMs: number): Promise<void> {
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
      { polling: MUTATION_POLL_INTERVAL_MS, timeout: budgetMs },
    )
    .catch(noopCleanup);
}

async function waitForActionSettled(window: Page, ceilingMs = afterActionWait): Promise<void> {
  const startedAt = Date.now();
  await waitForRequestsSettled(window, ceilingMs);
  const remainingMs = Math.max(0, ceilingMs - (Date.now() - startedAt));
  await waitForDomSettled(window, remainingMs);
}

export { waitForActionSettled };
