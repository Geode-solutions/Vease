import { beforeEach, describe, expect, test, vi } from "vitest";
import crsNavigationPlugin from "@vease/plugins/crs_navigation.client";
import { flushPromises } from "@vue/test-utils";
import { setupActivePinia } from "@vease_tests/utils";
import { useCrsStore } from "@ogw_front/stores/crs";

vi.setConfig({ testTimeout: 10_000 });

async function startOn(path: string): Promise<void> {
  await useRouter().push(path);
  await crsNavigationPlugin(useNuxtApp());
}

describe("crs_navigation plugin", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("a crs edit requested outside the viewer and the data manager goes to the viewer", async () => {
    await startOn("/infos");
    const push = vi.spyOn(useRouter(), "push");
    useCrsStore().requestCrsEdit("item-1");
    await flushPromises();
    expect(push).toHaveBeenCalledWith("/");
  });

  test("a crs edit requested in the data manager stays there", async () => {
    await startOn("/data_manager");
    const push = vi.spyOn(useRouter(), "push");
    useCrsStore().requestCrsEdit("item-1");
    await flushPromises();
    expect(push).not.toHaveBeenCalled();
  });
});
