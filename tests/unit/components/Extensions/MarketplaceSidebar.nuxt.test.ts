import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { MarketplaceExtension } from "@vease/types/marketplace_extension";
import MarketplaceSidebar from "@vease/components/Extensions/MarketplaceSidebar.vue";
import { VListItem } from "vuetify/components";
import { useAppStore } from "@ogw_front/stores/app";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: GLASS_CARD_STUB,
}));

const firstExtension: MarketplaceExtension = {
  id: "ext-alpha",
  description: "Alpha extension",
  version: "1.0.0",
};
const secondExtension: MarketplaceExtension = {
  id: "ext-beta",
  description: "Beta extension",
  version: "2.0.0",
};

function mockInstalledExtensions(installedIds: string[]): void {
  vi.mocked(useAppStore).mockReturnValue({
    getExtension: (id: string) => (installedIds.includes(id) ? { id } : undefined),
  } as unknown as ReturnType<typeof useAppStore>);
}

describe("the MarketplaceSidebar component", () => {
  beforeEach(() => {
    setupActivePinia();
    mockInstalledExtensions([]);
  });

  test("shows a loading indicator while pending", () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [], pending: true },
    });

    expect(wrapper.findComponent({ name: "VProgressCircular" }).exists()).toBe(true);
  });

  test("shows an error message when fetching failed", () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [], fetchError: true },
    });

    expect(wrapper.text()).toContain("Failed to load extensions");
  });

  test("shows an empty state when there are no extensions", () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [] },
    });

    expect(wrapper.text()).toContain("No extensions found");
  });

  test("lists every provided extension with its version", () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [firstExtension, secondExtension] },
    });

    expect(wrapper.text()).toContain("ext-alpha");
    expect(wrapper.text()).toContain("v1.0.0");
    expect(wrapper.text()).toContain("ext-beta");
    expect(wrapper.text()).toContain("v2.0.0");
  });

  test("filters extensions by the search query, matching id or description", async () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [firstExtension, secondExtension] },
    });

    const searchField = wrapper.find("input");
    await searchField.setValue("beta");

    expect(wrapper.text()).not.toContain("ext-alpha");
    expect(wrapper.text()).toContain("ext-beta");
  });

  test("emits update:modelValue with the clicked extension", async () => {
    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [firstExtension, secondExtension] },
    });

    const items = wrapper.findAllComponents(VListItem);
    await items[0]?.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[firstExtension]]);
  });

  test("marks an already installed extension with the checked puzzle icon", () => {
    mockInstalledExtensions([firstExtension.id]);

    const wrapper = mountWithPlugins(MarketplaceSidebar, {
      props: { extensions: [firstExtension, secondExtension] },
    });

    expect(wrapper.find(".mdi-puzzle-check-outline").exists()).toBe(true);
    expect(wrapper.find(".mdi-puzzle-outline").exists()).toBe(true);
  });
});
