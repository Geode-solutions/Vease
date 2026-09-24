import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useExtensionsStore } from "@vease/stores/extensions";
import { setupActivePinia } from "@vease_tests/utils";
import { useAppStore } from "@ogw_front/stores/app";

describe("extensions store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes app store and configures code transformer", () => {
    const extensionsStore = useExtensionsStore();
    const appStore = useAppStore();

    expect(extensionsStore).toBe(appStore);
  });
});
