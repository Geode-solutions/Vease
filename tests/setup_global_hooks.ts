import { afterEach, vi } from "vitest";

// Restoring only resets spyOn spies; module-mock vi.fn()s need clearing too.
// This hook is intentionally global (outside any describe block), so it
// Doesn't have to be repeated in every test file; the shared oxlint config
// Doesn't allow customizing require-top-level-describe for setup files.
// oxlint-disable-next-line vitest/require-top-level-describe
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  document.body.innerHTML = "";
});
