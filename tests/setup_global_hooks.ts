import { afterEach, vi } from "vitest";

// Restoring only resets spyOn spies; module-mock vi.fn()s need clearing too.
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  document.body.innerHTML = "";
});
