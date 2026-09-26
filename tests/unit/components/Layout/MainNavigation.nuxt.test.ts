import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import MainNavigation from "@vease/components/Layout/MainNavigation.vue";
import type SideBar from "@vease/components/Layout/SideBar.vue";
import type TopBar from "@vease/components/Layout/TopBar.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/Layout/SideBar.vue"), () => ({
  default: {
    name: "SideBar",
    template: "<div data-testid='sidebar-stub'>SideBar</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of SideBar this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  } as unknown as typeof SideBar,
}));

vi.mock(import("@vease/components/Layout/TopBar.vue"), () => ({
  default: {
    name: "TopBar",
    template: "<div data-testid='topbar-stub'>TopBar</div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of TopBar this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  } as unknown as typeof TopBar,
}));

describe("mainnavigation component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("renders topbar and sidebar child components", () => {
    const wrapper = mountWithPlugins(MainNavigation);

    expect(wrapper.find("[data-testid='topbar-stub']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='sidebar-stub']").exists()).toBe(true);
  });
});
