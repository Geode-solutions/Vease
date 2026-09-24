import { beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia } from "@vease_tests/utils";
import { useAppStore } from "@ogw_front/stores/app";
import { useExtensionsStore } from "@vease/stores/extensions";

vi.setConfig({ testTimeout: 10_000 });

describe("the extensions store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("initializes app store and configures code transformer", () => {
    const extensionsStore = useExtensionsStore();
    const appStore = useAppStore();

    expect(extensionsStore).toStrictEqual(appStore);
  });
});
