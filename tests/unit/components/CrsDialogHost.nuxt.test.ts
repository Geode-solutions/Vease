import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type CrsDialog from "@vease/components/datamanager/CrsDialog.vue";
import CrsDialogHost from "@vease/components/CrsDialogHost.vue";
import { flushPromises } from "@vue/test-utils";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

// Hoisted with vi.mock, so the stub exposes show and item to the test
const { CRS_DIALOG_STUB } = vi.hoisted(() => ({
  CRS_DIALOG_STUB: {
    name: "CrsDialog",
    props: ["show", "item"],
    emits: ["update:show", "assigned", "converted"],
    template:
      "<div data-testid='crsDialogStub' :data-show='show' :data-item='item && item.id'><button data-testid='closeStub' @click=\"$emit('update:show', false)\" /></div>",
  },
}));

vi.mock(import("@vease/components/datamanager/CrsDialog.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: CRS_DIALOG_STUB as unknown as typeof CrsDialog,
}));

describe("crs dialog host", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("opens the dialog on an edit request and clears it on close", async () => {
    vi.spyOn(useDataStore(), "item").mockResolvedValue({
      id: "item-1",
      geode_id: "00000000-0000-0000-0000-000000000001",
      name: "Points",
      viewer_type: "mesh",
      geode_object_type: "PointSet3D",
      visible: true,
      created_at: "",
    });
    const crsStore = useCrsStore();
    const wrapper = mountWithPlugins(CrsDialogHost);
    expect(crsStore.crsEditEnabled).toBe(true);

    crsStore.requestCrsEdit("item-1");
    await flushPromises();
    const dialog = wrapper.get('[data-testid="crsDialogStub"]');
    expect(dialog.attributes("data-show")).toBe("true");
    expect(dialog.attributes("data-item")).toBe("item-1");

    await wrapper.get('[data-testid="closeStub"]').trigger("click");
    expect(crsStore.crsEditRequest).toBeUndefined();

    crsStore.requestCrsEdit("item-1");
    await flushPromises();
    expect(wrapper.get('[data-testid="crsDialogStub"]').attributes("data-show")).toBe("true");
    wrapper.unmount();
  });
});
