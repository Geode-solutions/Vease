import { describe, expect, test, vi } from "vitest";
import GlobalComponents from "@vease/components/Extensions/GlobalComponents.vue";
import { mountWithPlugins } from "@vease_tests/utils";
import { useAppStore } from "@ogw_front/stores/app";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/app"), () => ({
  useAppStore: vi.fn<typeof useAppStore>(),
}));

function mockGlobalComponents(globalComponents: Map<string, Map<string, unknown>>): void {
  vi.mocked(useAppStore).mockReturnValue(
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial Pinia store, see tests/unit/server/utils/data_file.nuxt.test.ts
    { globalComponents } as unknown as ReturnType<typeof useAppStore>,
  );
}

describe("the GlobalComponents component", () => {
  test("renders no elements when no extension registered a global component", () => {
    mockGlobalComponents(new Map());

    const wrapper = mountWithPlugins(GlobalComponents);

    expect(wrapper.findAll("*")).toHaveLength(0);
  });

  test("renders every component registered across every extension", () => {
    const stubComponentA = { template: "<div class='comp-a'>Alpha content</div>" };
    const stubComponentB = { template: "<div class='comp-b'>Beta content</div>" };
    const globalComponents = new Map<string, Map<string, unknown>>([
      ["ext-alpha", new Map([["comp-a", stubComponentA]])],
      ["ext-beta", new Map([["comp-b", stubComponentB]])],
    ]);
    mockGlobalComponents(globalComponents);

    const wrapper = mountWithPlugins(GlobalComponents);

    expect(wrapper.text()).toContain("Alpha content");
    expect(wrapper.text()).toContain("Beta content");
  });

  test("renders multiple components registered by the same extension", () => {
    const stubComponentA = { template: "<div class='comp-a'>Alpha content</div>" };
    const stubComponentC = { template: "<div class='comp-c'>Gamma content</div>" };
    const globalComponents = new Map<string, Map<string, unknown>>([
      [
        "ext-alpha",
        new Map([
          ["comp-a", stubComponentA],
          ["comp-c", stubComponentC],
        ]),
      ],
    ]);
    mockGlobalComponents(globalComponents);

    const wrapper = mountWithPlugins(GlobalComponents);

    expect(wrapper.findAll(".comp-a")).toHaveLength(1);
    expect(wrapper.findAll(".comp-c")).toHaveLength(1);
  });
});
