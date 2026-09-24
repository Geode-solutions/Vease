// oxlint-disable sort-imports, vitest/require-test-timeout
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { importExtensionFile, importExtensionURL } from "@ogw_front/utils/extension";
import type { MarketplaceExtension } from "@vease/types/marketplace_extension";
import MarketplaceDetails from "@vease/components/Extensions/MarketplaceDetails.vue";
import { mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { useAppStore } from "@ogw_front/stores/app";
import { useExtensions } from "@vease/composables/extensions";
import { useInfraStore } from "@ogw_front/stores/infra";
import { VBtn, VProgressCircular } from "vuetify/components";

vi.mock(import("@ogw_front/utils/extension"), () => ({
  importExtensionFile: vi.fn<typeof importExtensionFile>(),
  importExtensionURL: vi.fn<typeof importExtensionURL>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

vi.mock(import("@ogw_front/stores/infra"), () => ({
  useInfraStore: vi.fn<typeof useInfraStore>(),
}));

vi.mock(import("@vease/composables/extensions"), () => ({
  useExtensions: vi.fn<typeof useExtensions>(),
}));

const mockExtensionUrl = "blob:http://localhost/ext-alpha.js";

const sampleExtension: MarketplaceExtension = {
  id: "ext-alpha",
  description: "Alpha extension description",
  version: "1.0.0",
  readme: "# Alpha Readme\nThis is alpha extension documentation.",
};

const extensionWithoutReadme: MarketplaceExtension = {
  id: "ext-beta",
  description: "Beta extension description",
  version: "2.1.0",
};

describe("the MarketplaceDetails component", () => {
  const downloadExtensionMock = vi.fn<(id: string) => Promise<string>>();

  beforeEach(() => {
    setupActivePinia();

    downloadExtensionMock.mockReset();
    downloadExtensionMock.mockResolvedValue(mockExtensionUrl);

    vi.mocked(useExtensions).mockReturnValue({
      downloadExtension: downloadExtensionMock,
      allowedExtensions: vi.fn<() => Promise<MarketplaceExtension[]>>(),
    } as unknown as ReturnType<typeof useExtensions>);

    vi.mocked(useAppStore).mockReturnValue({
      getExtension: vi.fn<(id: string) => unknown>().mockReturnValue(undefined),
    } as unknown as ReturnType<typeof useAppStore>);

    vi.mocked(useInfraStore).mockReturnValue({} as unknown as ReturnType<typeof useInfraStore>);

    vi.mocked(importExtensionURL).mockReset();
    vi.mocked(importExtensionURL).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders empty marketplace placeholder when no extension is provided", () => {
    const wrapper = mount(MarketplaceDetails, {
      props: { extension: undefined, pending: false },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("Marketplace");
    expect(wrapper.text()).toContain(
      "Select an extension from the list to view its details and install it.",
    );
  });

  test("renders loading circular progress when pending is true", () => {
    const wrapper = mount(MarketplaceDetails, {
      props: { extension: undefined, pending: true },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.findComponent(VProgressCircular).exists()).toBe(true);
    expect(wrapper.text()).toContain("Loading marketplace content...");
  });

  test("renders extension details header and readme when extension is passed", () => {
    const wrapper = mount(MarketplaceDetails, {
      props: { extension: sampleExtension },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("ext-alpha");
    expect(wrapper.text()).toContain("v1.0.0");
    expect(wrapper.text()).toContain("Install Extension");
    expect(wrapper.text()).toContain("Alpha Readme");
  });

  test("renders fallback readme message when extension lacks a readme", () => {
    const wrapper = mount(MarketplaceDetails, {
      props: { extension: extensionWithoutReadme },
      global: { plugins: [vuetify] },
    });

    expect(wrapper.text()).toContain("No README provided for this extension.");
  });

  test("disables install button and shows installed text if extension is already installed", () => {
    vi.mocked(useAppStore).mockReturnValue({
      getExtension: vi.fn<(id: string) => unknown>().mockReturnValue({ id: "ext-alpha" }),
    } as unknown as ReturnType<typeof useAppStore>);

    const wrapper = mount(MarketplaceDetails, {
      props: { extension: sampleExtension },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.findComponent(VBtn);
    expect(wrapper.text()).toContain("Already installed");
    expect(button.props("disabled")).toBe(true);
  });

  test("installs extension successfully when clicking the install button", async () => {
    const wrapper = mount(MarketplaceDetails, {
      props: { extension: sampleExtension },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.findComponent(VBtn);
    await button.trigger("click");

    expect(downloadExtensionMock.mock.calls).toStrictEqual([["ext-alpha"]]);
    expect(vi.mocked(importExtensionURL).mock.calls).toStrictEqual([[mockExtensionUrl]]);
    expect(wrapper.text()).toContain("Extension installed successfully!");
  });

  test("displays installation error message when downloadExtension fails", async () => {
    const failureMessage = "Network error downloading extension";
    downloadExtensionMock.mockRejectedValue(new Error(failureMessage));

    const wrapper = mount(MarketplaceDetails, {
      props: { extension: sampleExtension },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.findComponent(VBtn);
    await button.trigger("click");

    expect(wrapper.text()).toContain(failureMessage);
  });

  test("displays generic installation error message when thrown value is not Error instance", async () => {
    downloadExtensionMock.mockRejectedValue("unexpected error string");

    const wrapper = mount(MarketplaceDetails, {
      props: { extension: sampleExtension },
      global: { plugins: [vuetify] },
    });

    const button = wrapper.findComponent(VBtn);
    await button.trigger("click");

    expect(wrapper.text()).toContain("Failed to install extension.");
  });
});
