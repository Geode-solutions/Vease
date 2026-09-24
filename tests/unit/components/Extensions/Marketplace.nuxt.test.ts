import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Marketplace from "@vease/components/Extensions/Marketplace.vue";
import MarketplaceDetails from "@vease/components/Extensions/MarketplaceDetails.vue";
import type { MarketplaceExtension } from "@vease/types/marketplace_extension";
import MarketplaceSidebar from "@vease/components/Extensions/MarketplaceSidebar.vue";
import { useAppStore } from "@ogw_front/stores/app";
import { useAuth } from "@vease/composables/auth";
import { useExtensions } from "@vease/composables/extensions";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@vease/composables/extensions"), () => ({
  useExtensions: vi.fn<typeof useExtensions>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: GLASS_CARD_STUB,
}));

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

const sampleExtension: MarketplaceExtension = {
  id: "ext-alpha",
  description: "Alpha extension description",
  version: "1.0.0",
};

describe("the Marketplace component", () => {
  const allowedExtensionsMock = vi.fn<() => Promise<MarketplaceExtension[]>>();

  beforeEach(() => {
    setupActivePinia();

    allowedExtensionsMock.mockReset();
    allowedExtensionsMock.mockResolvedValue([sampleExtension]);

    vi.mocked(useAppStore).mockReturnValue({
      getExtension: vi.fn<(id: string) => unknown>().mockReturnValue(undefined),
    } as unknown as ReturnType<typeof useAppStore>);

    vi.mocked(useExtensions).mockReturnValue({
      allowedExtensions: allowedExtensionsMock,
      downloadExtension: vi.fn<() => Promise<string>>(),
    } as unknown as ReturnType<typeof useExtensions>);

    vi.mocked(useAuth).mockReturnValue({
      user: ref<{ email: string } | undefined>({ email: "user@example.com" }),
      isUserAuthenticated: computed(() => true),
      autoLogin: vi.fn<() => Promise<void>>(),
      register: vi.fn<() => Promise<void>>(),
      login: vi.fn<() => Promise<void>>(),
      logout: vi.fn<() => Promise<void>>(),
      deleteAccount: vi.fn<() => Promise<void>>(),
      resetPassword: vi.fn<() => Promise<void>>(),
    });
  });

  test("renders authentication required view when user is not logged in", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: ref<{ email: string } | undefined>(undefined),
      isUserAuthenticated: computed(() => false),
      autoLogin: vi.fn<() => Promise<void>>(),
      register: vi.fn<() => Promise<void>>(),
      login: vi.fn<() => Promise<void>>(),
      logout: vi.fn<() => Promise<void>>(),
      deleteAccount: vi.fn<() => Promise<void>>(),
      resetPassword: vi.fn<() => Promise<void>>(),
    });

    const wrapper = mountWithPlugins(Marketplace);

    expect(wrapper.text()).toContain("Authentication Required");
    expect(wrapper.text()).toContain("You must be logged in to access the marketplace");
    expect(wrapper.findComponent(MarketplaceSidebar).exists()).toBe(false);
    expect(wrapper.findComponent(MarketplaceDetails).exists()).toBe(false);
  });

  test("renders sidebar and details components when user is logged in", () => {
    const wrapper = mountWithPlugins(Marketplace);

    expect(wrapper.findComponent(MarketplaceSidebar).exists()).toBe(true);
    expect(wrapper.findComponent(MarketplaceDetails).exists()).toBe(true);
  });

  test("updates selected extension in details when sidebar emits update:modelValue", async () => {
    const wrapper = mountWithPlugins(Marketplace);

    const sidebar = wrapper.findComponent(MarketplaceSidebar);
    await sidebar.vm.$emit("update:modelValue", sampleExtension);

    const details = wrapper.findComponent(MarketplaceDetails);
    expect(details.props("extension")).toStrictEqual(sampleExtension);
  });
});
