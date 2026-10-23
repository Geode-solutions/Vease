import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CrsDialog from "@vease/components/datamanager/CrsDialog.vue";
import type CrsSelector from "@ogw_front/components/CrsSelector.vue";
import type { DataItem } from "@vease/types/data_item";
import type GlassCard from "@ogw_front/components/GlassCard.vue";
import { flushPromises } from "@vue/test-utils";
import { useBackStore } from "@ogw_front/stores/back";
import type { useCrs } from "@vease/composables/crs";
import { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;
const EXPECTED_REQUEST_COUNT = 2;

// Hoisted with vi.mock, so the CrsSelector stub can emit LAMBERT
const { LAMBERT, CRS_SELECTOR_STUB } = vi.hoisted(() => {
  const lambert = { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" };
  return {
    LAMBERT: lambert,
    CRS_SELECTOR_STUB: {
      name: "CrsSelector",
      emits: ["update:modelValue"],
      data: (): { crs: typeof lambert } => ({ crs: lambert }),
      template:
        "<button data-testid='crsSelectorStub' @click=\"$emit('update:modelValue', crs)\" />",
    },
  };
});
// Hoisted with vi.mock, so the useCrs mock can be checked by the tests
const { USE_CRS_MOCK, convertCrs } = vi.hoisted(() => {
  const convertMock = vi.fn<(...args: unknown[]) => Promise<void>>();
  return {
    convertCrs: convertMock,
    USE_CRS_MOCK: (): unknown => ({
      convertCrs: convertMock,
      alignCrs: vi.fn<() => Promise<void>>(),
    }),
  };
});
const UTM_RESPONSE = {
  crs_name: "EPSG:32631",
  crs_info: { authority: "EPSG", code: "32631", name: "WGS 84 / UTM zone 31N" },
};

const RESPONSES: Record<string, unknown> = {
  "opengeodeweb_back/crs/active": { crs_name: "points" },
  "opengeodeweb_back/crs/assign_geographic": {
    crs: { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" },
  },
};

type RequestMock = (
  request: { schema: { $id: string } },
  callbacks: { response_function?: (response: unknown) => void },
) => Promise<unknown>;

vi.mock(import("@vease/composables/crs"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
  useCrs: USE_CRS_MOCK as unknown as typeof useCrs,
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: GLASS_CARD_STUB as unknown as typeof GlassCard,
}));

vi.mock(import("@ogw_front/components/CrsSelector.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: CRS_SELECTOR_STUB as unknown as typeof CrsSelector,
}));

const mockItem: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Points",
  geode_object_type: "PointSet3D",
  viewer_type: "mesh",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("crs dialog component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("shows current crs and assigns the selected one", async () => {
    vi.spyOn(useDataStore(), "updateItem").mockResolvedValue(undefined);
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>(async ({ schema }, callbacks) => {
      const response = RESPONSES[schema.$id];
      callbacks.response_function?.(response);
      await Promise.resolve();
      return response;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();

    expect(document.body.querySelector('[data-testid="crsCurrentValue"]')?.textContent).toContain(
      "None (local coordinates)",
    );

    const assignButton = document.body.querySelector<HTMLButtonElement>(
      '[data-testid="crsAssignButton"]',
    );
    expect(assignButton?.disabled).toBe(true);

    document.body
      .querySelector('[data-testid="crsSelectorStub"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    assignButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: { id: "item-1", ...LAMBERT } }),
      expect.anything(),
    );
    expect(wrapper.emitted("assigned")?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(wrapper.emitted("update:show")?.[FIRST_EVENT_INDEX]).toStrictEqual([false]);
    wrapper.unmount();
  });

  test("ignores further clicks while assigning", async () => {
    const backStore = useBackStore();
    const request = vi
      .fn<RequestMock>()
      .mockImplementationOnce(async (_request, callbacks) => {
        callbacks.response_function?.({ crs_name: "points" });
        await Promise.resolve();
        return { crs_name: "points" };
      })
      // The assign save is still running when the user clicks again
      .mockReturnValueOnce(Promise.withResolvers<never>().promise);
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();
    document.body
      .querySelector('[data-testid="crsSelectorStub"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    const assignButton = document.body.querySelector<HTMLButtonElement>(
      '[data-testid="crsAssignButton"]',
    );
    assignButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    assignButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(request).toHaveBeenCalledTimes(EXPECTED_REQUEST_COUNT);
    expect(assignButton?.disabled).toBe(true);
    wrapper.unmount();
  });

  test("shows a loader while the current crs loads", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>().mockReturnValue(Promise.withResolvers<never>().promise);
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();

    expect(document.body.querySelector('[data-testid="crsCurrentLoading"]')).not.toBeNull();
    // The mode depends on the current crs: neither is offered before it is known
    expect(document.body.querySelector('[data-testid="crsModeAlign"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="crsModeConvert"]')).toBeNull();
    wrapper.unmount();
  });

  test("converts a geographic data to the selected crs", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>().mockImplementation(async (_request, callbacks) => {
      callbacks.response_function?.(UTM_RESPONSE);
      await Promise.resolve();
      return UTM_RESPONSE;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;
    convertCrs.mockReset().mockResolvedValue(undefined);

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();

    expect(document.body.querySelector('[data-testid="crsModeAlign"]')).toBeNull();
    document.body
      .querySelector('[data-testid="crsModeConvert"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    document.body
      .querySelector('[data-testid="crsSelectorStub"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    document.body
      .querySelector('[data-testid="crsConvertButton"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(convertCrs).toHaveBeenCalledWith(mockItem, LAMBERT);
    expect(wrapper.emitted("converted")?.length).toBe(EXPECTED_EVENT_COUNT);
    wrapper.unmount();
  });

  test("offers alignment for data without crs", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>().mockImplementation(async ({ schema }, callbacks) => {
      const response = RESPONSES[schema.$id];
      callbacks.response_function?.(response);
      await Promise.resolve();
      return response;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();

    expect(document.body.querySelector('[data-testid="crsModeConvert"]')).toBeNull();
    document.body
      .querySelector('[data-testid="crsModeAlign"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(document.body.querySelector('[data-testid="crsStartAlignButton"]')).not.toBeNull();
    wrapper.unmount();
  });

  test("refreshes the stored crs from the file", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>().mockImplementation(async (_request, callbacks) => {
      callbacks.response_function?.(UTM_RESPONSE);
      await Promise.resolve();
      return UTM_RESPONSE;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;
    const updateItem = vi.spyOn(useDataStore(), "updateItem").mockResolvedValue(undefined);

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();

    expect(updateItem).toHaveBeenCalledWith("item-1", { crs: UTM_RESPONSE.crs_info });
    wrapper.unmount();
  });

  test("does not rewrite a stored crs that did not change", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>().mockImplementation(async (_request, callbacks) => {
      callbacks.response_function?.(UTM_RESPONSE);
      await Promise.resolve();
      return UTM_RESPONSE;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;
    const updateItem = vi.spyOn(useDataStore(), "updateItem").mockResolvedValue(undefined);

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: { ...mockItem, crs: UTM_RESPONSE.crs_info } },
      attachTo: document.body,
    });
    await flushPromises();

    expect(updateItem).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  test("stores the assigned crs", async () => {
    const backStore = useBackStore();
    const request = vi.fn<RequestMock>(async ({ schema }, callbacks) => {
      const response = RESPONSES[schema.$id];
      callbacks.response_function?.(response);
      await Promise.resolve();
      return response;
    });
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock covers only the calls this suite makes
    backStore.request = request as unknown as typeof backStore.request;
    const updateItem = vi.spyOn(useDataStore(), "updateItem").mockResolvedValue(undefined);

    const wrapper = mountWithPlugins(CrsDialog, {
      props: { show: true, item: mockItem },
      attachTo: document.body,
    });
    await flushPromises();
    document.body
      .querySelector('[data-testid="crsSelectorStub"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    document.body
      .querySelector('[data-testid="crsAssignButton"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(updateItem).toHaveBeenLastCalledWith("item-1", { crs: LAMBERT });
    wrapper.unmount();
  });
});
